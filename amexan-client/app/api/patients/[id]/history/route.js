// app/api/patients/[id]/history/route.js
import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await auth.verifyIdToken(token);
    // Allow if same user or doctor
    if (decodedToken.uid !== id) {
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (!userDoc.exists || userDoc.data().role !== 'doctor') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    const historySnapshot = await db.collection('patients').doc(id).collection('history')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    
    if (historySnapshot.empty) {
      return NextResponse.json({ history: null });
    }
    const latestHistory = historySnapshot.docs[0].data();
    return NextResponse.json({ history: latestHistory });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await auth.verifyIdToken(token);
    // Only doctors can create history
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'doctor') {
      return NextResponse.json({ error: 'Only doctors can create history' }, { status: 403 });
    }
    
    const { data } = await request.json();
    
    // Determine version number
    const historyRef = db.collection('patients').doc(id).collection('history');
    const latestSnapshot = await historyRef.orderBy('version', 'desc').limit(1).get();
    let version = 1;
    if (!latestSnapshot.empty) {
      version = latestSnapshot.docs[0].data().version + 1;
    }
    
    // Create digital signature (simple hash for demo)
    const signature = require('crypto')
      .createHash('sha256')
      .update(JSON.stringify({ patientId: id, authorId: decodedToken.uid, data, version }))
      .digest('hex');
    
    const historyEntry = {
      patientId: id,
      authorId: decodedToken.uid,
      version,
      data,
      signature,
      createdAt: new Date(),
    };
    
    await historyRef.add(historyEntry);
    
    return NextResponse.json({ success: true, version });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
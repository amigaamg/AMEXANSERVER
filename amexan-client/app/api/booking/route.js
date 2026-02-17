// app/api/booking/route.js
import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { patientId, doctorId, clinicType, date, triageAnswers } = await request.json();
    
    // Validate token (assuming you send the Firebase ID token in Authorization header)
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken.uid !== patientId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if this is first visit
    const previousAppointments = await db.collection('appointments')
      .where('patientId', '==', patientId)
      .where('doctorId', '==', doctorId)
      .get();
    const isFirstVisit = previousAppointments.empty;
    
    const appointmentData = {
      patientId,
      doctorId,
      clinicType,
      date: new Date(date),
      status: 'scheduled',
      isFirstVisit,
      triageAnswers,
      createdAt: new Date(),
    };
    
    const docRef = await db.collection('appointments').add(appointmentData);
    
    return NextResponse.json({ id: docRef.id, ...appointmentData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
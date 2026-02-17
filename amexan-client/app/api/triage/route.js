// app/api/triage/route.js
import { NextResponse } from 'next/server';
import triageTree from '@/lib/triageTree.json'; // we'll create this

export async function POST(request) {
  try {
    const { answers } = await request.json();
    
    // Simple rule evaluation (can be more sophisticated)
    let recommendation = 'general';
    let message = 'General check-up recommended.';
    
    if (answers.symptoms?.includes('chest_pain')) {
      recommendation = 'emergency';
      message = 'Please go to the nearest emergency room immediately.';
    } else if (answers.symptoms?.some(s => ['headache', 'dizziness', 'blurred_vision'].includes(s))) {
      if (answers.q2_risk === 'yes') {
        if (answers.q3_meds === 'no') {
          recommendation = 'hypertension_first_visit';
          message = 'You may have undiagnosed hypertension. Book a first visit.';
        } else {
          recommendation = 'hypertension_followup';
          message = 'Follow up with your hypertension doctor.';
        }
      } else {
        recommendation = 'hypertension_evaluation';
        message = 'Your symptoms suggest a blood pressure check.';
      }
    }
    
    return NextResponse.json({ recommendation, message });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
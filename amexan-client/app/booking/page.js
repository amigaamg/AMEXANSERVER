'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TriageFlow from '@/components/booking/TriageFlow';
import DoctorList from '@/components/booking/DoctorList';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

export default function BookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: triage, 2: select doctor, 3: confirm
  const [recommendation, setRecommendation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [triageAnswers, setTriageAnswers] = useState(null);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleTriageComplete = (rec, answers) => {
    setRecommendation(rec);
    setTriageAnswers(answers);
    setStep(2);
  };

  const handleDoctorSelect = (doctor, clinic) => {
    setSelectedDoctor(doctor);
    setSelectedClinic(clinic);
    setStep(3);
  };

  const handleConfirm = async (date) => {
    // final booking API call will be made in confirmation component
    setSelectedDate(date);
    // after booking, go to dashboard
    // router.push('/dashboard/patient');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book a Consultation</h1>
      {step === 1 && <TriageFlow onComplete={handleTriageComplete} />}
      {step === 2 && (
        <DoctorList
          recommendation={recommendation}
          onSelect={handleDoctorSelect}
        />
      )}
      {step === 3 && (
        <BookingConfirmation
          doctor={selectedDoctor}
          clinic={selectedClinic}
          triageAnswers={triageAnswers}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
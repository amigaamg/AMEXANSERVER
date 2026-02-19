'use client';

import { useState } from 'react';
import StepWizard from '@/components/common/StepWizard';
import BookingStep1_SelectSlot from './BookingStep1_SelectSlot';
import BookingStep2_Reason from './BookingStep2_Reason';
import BookingStep3_Payment from './BookingStep3_Payment';
import BookingStep4_Confirmation from './BookingStep4_Confirmation';
import type { Doctor } from '@/types/doctor';

interface BookingFlowProps {
  doctor: Doctor;
  onComplete: () => void;
}

export default function BookingFlow({ doctor, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState('slot');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [availableDates] = useState([new Date(), new Date(Date.now() + 86400000)]); // mock

  const steps = [
    { id: 'slot', label: 'Select Slot' },
    { id: 'reason', label: 'Reason' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

  const handleNext = () => {
    if (step === 'slot') setStep('reason');
    else if (step === 'reason') setStep('payment');
    else if (step === 'payment') setStep('confirm');
  };

  const handlePrev = () => {
    if (step === 'reason') setStep('slot');
    else if (step === 'payment') setStep('reason');
    else if (step === 'confirm') setStep('payment');
  };

  return (
    <StepWizard
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onComplete={onComplete}
      isFirst={step === 'slot'}
      isLast={step === 'confirm'}
    >
      {step === 'slot' && (
        <BookingStep1_SelectSlot
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          availableDates={availableDates}
          onNext={handleNext}
        />
      )}
      {step === 'reason' && (
        <BookingStep2_Reason
          reason={reason}
          notes={notes}
          onReasonChange={setReason}
          onNotesChange={setNotes}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {step === 'payment' && (
        <BookingStep3_Payment
          amount={doctor.consultationFee}
          patientId="patient-id" // will be provided by parent
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {step === 'confirm' && (
        <BookingStep4_Confirmation onComplete={onComplete} />
      )}
    </StepWizard>
  );
}
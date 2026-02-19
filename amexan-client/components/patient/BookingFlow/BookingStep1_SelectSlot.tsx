import React from 'react';
import CalendarPicker from '@/components/common/CalendarPicker';

interface BookingStep1Props {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  availableDates: Date[];
  onNext: () => void;
}

export default function BookingStep1_SelectSlot({ selectedDate, onSelectDate, availableDates, onNext }: BookingStep1Props) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Select Date & Time</h3>
      <CalendarPicker
        selectedDate={selectedDate}
        onSelect={onSelectDate}
        availableDates={availableDates}
      />
      <button onClick={onNext} disabled={!selectedDate} style={{ marginTop: 16 }}>Next</button>
    </div>
  );
}
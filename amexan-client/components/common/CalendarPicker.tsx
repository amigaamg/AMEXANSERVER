import React, { useState } from 'react';
import Button from './Button';

interface CalendarPickerProps {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  availableDates?: Date[];
  style?: React.CSSProperties;
}

export default function CalendarPicker({ selectedDate, onSelect, availableDates = [], style }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return availableDates.some(d => d.toDateString() === date.toDateString());
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: 40, height: 40 }} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const available = isAvailable(d);
      days.push(
        <button
          key={d}
          onClick={() => onSelect(date)}
          disabled={!available}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: isSelected ? '#2563eb' : available ? 'white' : '#f1f5f9',
            color: isSelected ? 'white' : available ? '#1e293b' : '#94a3b8',
            cursor: available ? 'pointer' : 'default',
            fontWeight: isSelected ? 600 : 400,
          }}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>◀</button>
        <span style={{ fontWeight: 600 }}>
          {currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>▶</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, justifyItems: 'center', marginBottom: 8 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{ fontSize: 12, color: '#64748b' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, justifyItems: 'center' }}>
        {renderDays()}
      </div>
    </div>
  );
}
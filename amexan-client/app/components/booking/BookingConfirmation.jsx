'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingConfirmation({ doctor, clinic, triageAnswers, onConfirm }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleBook = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE}/api/appointments`, {
        doctorId: doctor._id,
        clinicType: clinic.name,
        date: selectedDate,
        triageAnswers,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally redirect to payment
      onConfirm(selectedDate);
      // show success message
      alert('Appointment booked successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
      <p><strong>Doctor:</strong> Dr. {doctor.name}</p>
      <p><strong>Clinic:</strong> {clinic.name}</p>
      <p><strong>Price:</strong> KSh {clinic.price}</p>
      <div className="mt-4">
        <label className="block mb-2">Select Date & Time</label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleBook}
        disabled={loading}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Booking...' : 'Confirm & Pay'}
      </button>
    </div>
  );
}
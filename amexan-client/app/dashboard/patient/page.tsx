"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("amexan_user") || "{}")
      : {};

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user._id) return;

    axios
      .get(`${API_BASE}/api/appointments/patient/${user._id}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Failed to fetch appointments", err));
  }, [user._id, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome {user.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* BOOK NEW */}
        <div
          onClick={() => router.push("/dashboard/patient/book")}
          className="border p-6 rounded cursor-pointer hover:shadow"
        >
          <h2 className="text-lg font-semibold">🩺 Book Consultation</h2>
          <p className="text-gray-600">Browse available services</p>
        </div>

        {/* HISTORY */}
        <div className="border p-6 rounded">
          <h2 className="text-lg font-semibold mb-4">📅 Booking History</h2>

          {appointments.length === 0 && (
            <p className="text-gray-500">No bookings yet</p>
          )}

          {appointments.map(appt => (
            <div key={appt._id} className="mb-3 border-b pb-2">
              <p><strong>{appt.serviceId?.title}</strong></p>
              <p>Doctor: Dr. {appt.doctorId?.name}</p>
              <p>Status: {appt.status} / Payment: {appt.paymentStatus}</p>
              <p>Date: {appt.date}</p>
              {appt.paymentStatus === "paid" && appt.status === "confirmed" && (
                <button
                  onClick={() => joinConsultation(appt._id)}
                  className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
                >
                  Join Consultation
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DoctorAppointmentsClient() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  // Safely get user from localStorage (client-side only)
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("amexan_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${API_BASE}/api/appointments/doctor/${user._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to fetch appointments", err));
  }, [user, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt._id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Patient:</strong> {appt.patientId?.name || "Unknown"}</p>
            <p><strong>Service:</strong> {appt.serviceId?.title}</p>
            <p><strong>Date:</strong> {appt.date} at {appt.startTime}</p>
            <p><strong>Status:</strong> {appt.status} / Payment: {appt.paymentStatus}</p>

            {appt.paymentStatus === "paid" && appt.status === "confirmed" && (
              <button
                onClick={() => joinConsultation(appt._id)}
                className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
              >
                Join Consultation
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
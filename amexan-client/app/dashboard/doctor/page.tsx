"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem("amexan_user") || "{}");
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user._id) return;
    axios
      .get(`${API_BASE}/api/appointments/doctor/${user._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to fetch appointments", err));
  }, [user._id, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

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
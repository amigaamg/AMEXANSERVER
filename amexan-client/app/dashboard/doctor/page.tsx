"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("amexan_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
  }, [router]);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${API_BASE}/api/appointments/doctor/${user._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to fetch appointments", err))
      .finally(() => setLoading(false));
  }, [user, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

  if (!user) return <div className="p-6 text-center">Loading user...</div>;
  if (loading) return <div className="p-6 text-center">Loading appointments...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <button
          onClick={() => router.push("/dashboard/doctor/services/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Create New Service
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((apt) => (
          <div key={apt._id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Patient:</strong> {apt.patientId?.name || "Unknown"}</p>
            <p><strong>Service:</strong> {apt.serviceId?.title}</p>
            <p><strong>Date:</strong> {apt.date} at {apt.startTime}</p>
            <p><strong>Status:</strong> {apt.status} / Payment: {apt.paymentStatus}</p>
            {apt.paymentStatus === "paid" && apt.status === "confirmed" && (
              <button
                onClick={() => joinConsultation(apt._id)}
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
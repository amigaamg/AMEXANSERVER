"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PatientDashboard() {
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
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/appointments/patient/${user._id}`);
        // Handle both wrapped and unwrapped responses
        const data = res.data.appointments || res.data;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

  if (!user) return <div className="p-6 text-center">Loading user...</div>;
  if (loading) return <div className="p-6 text-center">Loading appointments...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          onClick={() => router.push("/dashboard/patient/book")}
          className="border p-6 rounded cursor-pointer hover:shadow"
        >
          <h2 className="text-lg font-semibold">🩺 Book Consultation</h2>
          <p className="text-gray-600">Browse available services</p>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-lg font-semibold mb-4">📅 Your Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet.</p>
          ) : (
            appointments.map((apt) => {
              const canJoin = apt.paymentStatus === "paid" && apt.status === "confirmed";
              return (
                <div key={apt._id} className="mb-3 border-b pb-2">
                  <p><strong>{apt.serviceId?.title || "Service"}</strong></p>
                  <p>Doctor: Dr. {apt.doctorId?.name || "Unknown"}</p>
                  <p>Date: {new Date(apt.date).toLocaleString()}</p>
                  <p>Status: {apt.status} / Payment: {apt.paymentStatus}</p>
                  {canJoin && (
                    <button
                      onClick={() => joinConsultation(apt._id)}
                      className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
                    >
                      Join Consultation
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
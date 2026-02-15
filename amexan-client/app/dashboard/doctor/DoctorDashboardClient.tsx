"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DoctorDashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("amexan_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "doctor") {
      router.push("/dashboard/patient");
      return;
    }
    setUser(parsedUser);
    setLoadingUser(false);
  }, [router]);

  useEffect(() => {
    if (!user?._id) return;
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for doctor:", user._id);
        const res = await axios.get(`${API_BASE}/api/appointments/doctor/${user._id}`);
        console.log("Appointments response:", res.data);
        // Handle both wrapped and direct arrays
        const data = res.data.appointments || res.data || [];
        setAppointments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch appointments:", err);
        setError(err.response?.data?.error || err.message || "Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [user?._id, API_BASE]);

  const joinConsultation = (appointmentId: string) => {
    router.push(`/consultation/${appointmentId}`);
  };

  if (loadingUser) return <div className="p-6 text-center">Loading user...</div>;
  if (loadingAppointments) return <div className="p-6 text-center">Loading appointments...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">Error: {error}</div>;

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
        appointments.map((apt) => {
          const dateTime = apt.date
            ? new Date(apt.date).toLocaleString()
            : "No date";
          const patientName = apt.patientId?.name || apt.patient?.name || "Unknown patient";
          const serviceTitle = apt.serviceId?.title || apt.service?.title || "Service";
          const canJoin = apt.paymentStatus === "paid" && apt.status === "confirmed";

          return (
            <div key={apt._id} className="border p-4 mb-4 rounded shadow">
              <p><strong>Patient:</strong> {patientName}</p>
              <p><strong>Service:</strong> {serviceTitle}</p>
              <p><strong>Date:</strong> {dateTime}</p>
              <p><strong>Status:</strong> {apt.status} | Payment: {apt.paymentStatus}</p>
              {canJoin && (
                <button
                  onClick={() => joinConsultation(apt._id)}
                  className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
                >
                  ▶ Start Consultation
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
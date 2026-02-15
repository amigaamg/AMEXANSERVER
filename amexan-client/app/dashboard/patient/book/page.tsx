"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookService() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/services`)
      .then((res) => {
        // If backend returns { status: "success", services }, handle it
        const data = res.data.services || res.data;
        setServices(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
        alert("Could not load services. Please try again.");
      });
  }, [API_BASE]);

  const handleBook = async (service: any) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("amexan_user") || "{}");
      if (!user._id) {
        alert("You must be logged in.");
        router.push("/login");
        return;
      }

      const res = await axios.post(`${API_BASE}/api/appointments/create`, {
        patientId: user._id,
        doctorId: service.doctorId?._id,
        serviceId: service._id,
        date: new Date().toISOString().split("T")[0],
        startTime: "10:00",
      });

      // Handle both wrapped and direct responses
      const appointment = res.data.appointment || res.data;
      const appointmentId = appointment._id || appointment.id;

      if (!appointmentId) {
        throw new Error("No appointment ID returned");
      }

      router.push(`/dashboard/patient/payment/${appointmentId}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.response?.data?.error || err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Available Services</h2>

      {services.length === 0 ? (
        <p>No services available at the moment.</p>
      ) : (
        services.map((service) => (
          <div key={service._id} className="border p-4 mb-4 rounded">
            <h3 className="font-bold text-lg">{service.title}</h3>
            <p>{service.description}</p>
            <p>Doctor: Dr. {service.doctorId?.name || "Unknown"}</p>
            <p>Duration: {service.durationMinutes} mins</p>
            <p className="font-bold">KES {service.price || 1}</p>

            <button
              onClick={() => handleBook(service)}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 mt-3 rounded disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Book & Pay"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
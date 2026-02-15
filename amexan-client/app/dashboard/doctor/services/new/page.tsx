"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const stored = localStorage.getItem("amexan_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      alert("Please log in");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/services/create`, {
        doctorId: user._id,
        title,
        description,
        durationMinutes: duration,
        price,
      });
      router.push("/dashboard/doctor");
    } catch (err) {
      console.error(err);
      alert("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Service Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price (KES)"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
          step="0.01"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}
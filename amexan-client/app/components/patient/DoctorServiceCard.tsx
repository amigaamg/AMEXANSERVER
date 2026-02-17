'use client';

import { useRouter } from 'next/navigation';

interface DoctorServiceCardProps {
  service: any; // Replace with proper type
}

export default function DoctorServiceCard({ service }: DoctorServiceCardProps) {
  const router = useRouter();
  const doctor = service.doctorId || {};

  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition">
      <h3 className="font-semibold">Dr. {doctor.name}</h3>
      <p className="text-sm text-gray-600">{service.name}</p>
      <p className="text-xs text-gray-500 mt-1">{service.duration} min</p>
      <p className="text-sm font-bold mt-2">KSh {service.price}</p>
      <button
        onClick={() => router.push(`/booking?doctor=${doctor._id}&clinic=${service._id}`)}
        className="mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
      >
        Book
      </button>
    </div>
  );
}
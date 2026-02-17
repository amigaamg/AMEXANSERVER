import Link from 'next/link';

export default function AppointmentRow({ appointment }) {
  const isFirst = appointment.isFirstVisit;
  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">
          {appointment.patientId?.name}
          {isFirst && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">FIRST VISIT</span>}
        </p>
        <p className="text-sm text-gray-600">{appointment.clinicType}</p>
        <p className="text-xs">{new Date(appointment.date).toLocaleTimeString()}</p>
      </div>
      <Link href={`/consultation/${appointment._id}`}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Start</button>
      </Link>
    </div>
  );
}
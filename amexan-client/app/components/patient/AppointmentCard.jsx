export default function AppointmentCard({ appointment }) {
  const canJoin = appointment.paymentStatus === 'paid' && appointment.status === 'scheduled';
  return (
    <div className="border p-3 rounded mb-2">
      <p><strong>{appointment.clinicType}</strong></p>
      <p>Dr. {appointment.doctorId?.name}</p>
      <p>{new Date(appointment.date).toLocaleString()}</p>
      <p>Status: {appointment.status} / Payment: {appointment.paymentStatus}</p>
      {canJoin && (
        <button
          onClick={() => window.location.href = `/consultation/${appointment._id}`}
          className="bg-green-600 text-white px-4 py-1 mt-2 rounded text-sm"
        >
          Join Consultation
        </button>
      )}
    </div>
  );
}
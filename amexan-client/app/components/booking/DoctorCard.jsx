export default function DoctorCard({ clinic, onSelect }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md">
      <h3 className="font-bold text-lg">Dr. {clinic.doctorId?.name}</h3>
      <p className="text-gray-600">{clinic.name}</p>
      <p className="text-sm">{clinic.description}</p>
      <p className="text-sm">Duration: {clinic.duration} min</p>
      <p className="text-sm font-semibold">KSh {clinic.price}</p>
      <button
        onClick={() => onSelect(clinic.doctorId, clinic)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Select
      </button>
    </div>
  );
}
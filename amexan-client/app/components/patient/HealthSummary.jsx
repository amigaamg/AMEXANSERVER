export default function HealthSummary({ latestBP }) {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Health Summary</h2>
      {latestBP ? (
        <div>
          <p>Last BP: {latestBP.value.systolic}/{latestBP.value.diastolic} mmHg</p>
          <p className="text-sm text-gray-500">{new Date(latestBP.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No recent BP readings.</p>
      )}
    </div>
  );
}
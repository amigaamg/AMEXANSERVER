export default function AlertList({ alerts }) {
  if (alerts.length === 0) return <p className="text-gray-500">No alerts.</p>;
  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Alerts</h2>
      <ul className="space-y-2">
        {alerts.map(alert => (
          <li key={alert._id} className={`p-2 rounded ${alert.severity === 'critical' ? 'bg-red-100' : alert.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
            <p className="font-semibold">{alert.message}</p>
            <p className="text-xs text-gray-600">{new Date(alert.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
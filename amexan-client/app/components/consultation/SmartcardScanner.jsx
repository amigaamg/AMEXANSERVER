'use client';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

export default function SmartcardScanner({ onScan }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleScan = async (result) => {
    if (result) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE}/api/smartcard/scan`, { encryptedData: result.text }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        onScan(res.data);
      } catch (err) {
        setError('Invalid QR code');
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Scan Patient Smartcard</h2>
      <QrReader
        onResult={handleScan}
        constraints={{ facingMode: 'environment' }}
        className="w-full max-w-sm"
      />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {data && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Patient Data</h3>
          <p>Name: {data.name}</p>
          <p>Universal ID: {data.universalId}</p>
          <p>Blood Group: {data.bloodGroup}</p>
          <p>Allergies: {data.allergies?.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
}
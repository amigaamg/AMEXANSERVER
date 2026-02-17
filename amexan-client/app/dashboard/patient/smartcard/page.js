'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';

export default function SmartcardPage() {
  const { user } = useAuth();
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) return;
    const fetchQR = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/smartcard/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQr(res.data.qr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, [user, API_BASE]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Your Smartcard</h1>
      {qr && <img src={qr} alt="Smartcard QR" className="mx-auto border p-2" />}
      <p className="mt-4 text-sm text-gray-600">Show this QR to healthcare providers for quick access.</p>
    </div>
  );
}
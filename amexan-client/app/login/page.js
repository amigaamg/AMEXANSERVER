'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // ✅ FIX: Removed `: React.FormEvent` — this is a .js file, not .tsx
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      const { user, token } = res.data;

      // Ensure user._id exists (backend may send 'id')
      if (!user._id && user.id) user._id = user.id;

      login(user, token);

      if (user.role === 'doctor') router.push('/dashboard/doctor');
      else if (user.role === 'patient') router.push('/dashboard/patient');
      else router.push('/dashboard');
    // ✅ FIX: Removed `: any` — not valid in plain JavaScript
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot reach backend. Make sure the server is running.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Login failed');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚕️</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Welcome to AMEXAN</h1>
          <p style={{ color: '#64748b' }}>Sign in to your health account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: 8 }}>
            Sign In
          </Button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
          Secure login powered by JWT
        </p>
      </Card>
    </div>
  );
}
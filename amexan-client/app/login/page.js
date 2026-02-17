'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Use alias

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      // ✅ Ensure user object has _id (sometimes backend sends 'id')
      if (!user._id && user.id) {
        user._id = user.id;
      }

      console.log('Login successful, user:', user); // Debug log

      login(user, token);

      // Redirect based on role
      if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (user.role === 'patient') {
        router.push('/dashboard/patient');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('❌ Cannot reach backend. Make sure the server is running.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Login failed');
      } else if (err.request) {
        setError('No response from server. Check your network.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h1>Login to AMEXAN</h1>
      {error && (
        <div style={{ color: 'red', background: '#ffeeee', padding: '0.5rem', borderRadius: 4, marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
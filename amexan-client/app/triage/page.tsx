'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { SPECIALTIES } from '@/lib/config/specialties';

export default function TriagePage() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const runTriage = () => {
    const s = symptoms.toLowerCase();
    let matched = SPECIALTIES.find(spec =>
      spec.triageKeywords.some(keyword => s.includes(keyword))
    );
    setRecommendation(matched?.name || 'General Medicine');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 24 }}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Symptom Checker</h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Answer a few questions to find the right care.</p>
        <Input label="Describe your symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g., headache, chest pain" />
        <Input label="How long have you had them?" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 3 days, 2 weeks" />
        <Input label="Severity (mild/moderate/severe)" value={severity} onChange={e => setSeverity(e.target.value)} placeholder="mild" />
        <Button variant="primary" onClick={runTriage} style={{ marginTop: 16 }}>Check</Button>

        {recommendation && (
          <div style={{ marginTop: 24, padding: 16, background: '#eff6ff', borderRadius: 12 }}>
            <p style={{ fontWeight: 600 }}>We recommend: <span style={{ color: '#2563eb' }}>{recommendation}</span></p>
            <Button variant="outline" onClick={() => router.push(`/dashboard/patient/doctors?specialty=${encodeURIComponent(recommendation)}`)} style={{ marginTop: 12 }}>
              Find {recommendation} Doctors
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
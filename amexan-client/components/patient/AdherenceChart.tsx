import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Medication } from '@/types/patient';

interface AdherenceChartProps {
  medications: Medication[];
  days?: number;
}

export default function AdherenceChart({ medications, days = 7 }: AdherenceChartProps) {
  // Mock data – in real app, fetch adherence records
  const data = Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    adherence: Math.floor(Math.random() * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="adherence" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}
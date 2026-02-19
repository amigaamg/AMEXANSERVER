import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Measurement } from '@/types/patient';

interface VitalsChartProps {
  measurements: Measurement[];
  type: 'bp' | 'glucose' | 'peakflow';
  height?: number;
}

export default function VitalsChart({ measurements, type, height = 200 }: VitalsChartProps) {
  const data = measurements.slice().reverse().map(m => ({
    date: new Date(m.recordedAt).toLocaleDateString(),
    systolic: m.systolic,
    diastolic: m.diastolic,
    value: m.value,
  }));

  if (type === 'bp') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[60, 200]} />
          <Tooltip />
          <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
          <Line type="monotone" dataKey="diastolic" stroke="#2563eb" name="Diastolic" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2563eb" name={type} />
      </LineChart>
    </ResponsiveContainer>
  );
}
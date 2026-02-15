"use client";
import dynamic from 'next/dynamic';

const DoctorAppointmentsClient = dynamic(
  () => import('./DoctorAppointmentsClient'),
  { ssr: false }
);

export default function DoctorAppointmentsPage() {
  return <DoctorAppointmentsClient />;
}
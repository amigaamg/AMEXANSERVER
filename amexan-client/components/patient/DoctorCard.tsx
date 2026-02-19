import React from 'react';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import RatingStars from '@/components/common/RatingStars';
import Button from '@/components/common/Button';
import type { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: () => void;
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <Card style={{ cursor: 'pointer' }} onClick={onBook}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar name={doctor.name} size={48} />
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Dr. {doctor.name}</h3>
          <p style={{ fontSize: 13, color: '#2563eb' }}>{doctor.specialty}</p>
        </div>
      </div>
      <div style={{ marginBottom: 8, fontSize: 13, color: '#64748b' }}>
        {doctor.qualifications?.join(', ')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <RatingStars rating={doctor.rating} size={16} />
        <span style={{ fontSize: 12, color: '#64748b' }}>({doctor.reviewCount} reviews)</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 700 }}>KES {doctor.consultationFee}</span>
        {doctor.available ? (
          <Badge variant="success">Available</Badge>
        ) : (
          <Badge variant="default">Unavailable</Badge>
        )}
      </div>
      <Button variant="primary" style={{ width: '100%' }}>Book Consultation</Button>
    </Card>
  );
}
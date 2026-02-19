import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <Card>
      <h4 style={{ fontSize: 16, fontWeight: 600 }}>{service.name}</h4>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{service.specialty}</p>
      <p style={{ fontSize: 13 }}>{service.description}</p>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <Badge variant={service.available ? 'success' : 'default'}>
          {service.available ? 'Available' : 'Unavailable'}
        </Badge>
        <Badge variant="info" style={{ marginLeft: 8 }}>{service.duration} min</Badge>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>KES {service.price}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  );
}
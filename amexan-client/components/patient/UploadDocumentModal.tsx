import { useState } from 'react';
import Modal from '@/components/common/Modal';
import FileUpload from '@/components/common/FileUpload';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onUploaded: () => void;
}

export default function UploadDocumentModal({ open, onClose, patientId, onUploaded }: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'lab' | 'imaging' | 'other'>('lab');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('description', description);
    try {
      await api(`/api/patients/${patientId}/documents`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded();
      onClose();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Document" width={500}>
      <FileUpload onUpload={setFile} accept=".pdf,.jpg,.jpeg,.png" />
      {file && (
        <>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Document Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            >
              <option value="lab">Lab Result</option>
              <option value="imaging">Imaging</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
          </div>
          <Button variant="primary" onClick={handleUpload} loading={loading} style={{ marginTop: 16, width: '100%' }}>Upload</Button>
        </>
      )}
    </Modal>
  );
}
import React, { useRef, useState } from 'react';
import Button from './Button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // MB
  label?: string;
  style?: React.CSSProperties;
}

export default function FileUpload({ onUpload, accept = 'image/*', maxSize = 5, label = 'Upload File', style }: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB`);
      return;
    }
    setError(null);
    onUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={style}>
      <div
        onClick={() => fileRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#2563eb' : '#e2e8f0'}`,
          borderRadius: 8,
          padding: 32,
          textAlign: 'center',
          background: dragActive ? '#eff6ff' : '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
        <span style={{ fontSize: 24, marginBottom: 8 }}>📎</span>
        <p style={{ fontWeight: 600, color: '#1e293b' }}>{label}</p>
        <p style={{ fontSize: 12, color: '#64748b' }}>or drag and drop</p>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Max {maxSize}MB</p>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>{error}</p>}
    </div>
  );
}
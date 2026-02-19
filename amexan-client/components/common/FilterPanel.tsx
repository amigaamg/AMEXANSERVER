import React from 'react';
import Button from './Button';

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onApply: () => void;
  onClear: () => void;
  style?: React.CSSProperties;
}

export default function FilterPanel({ filters, values, onChange, onApply, onClear, style }: FilterPanelProps) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', ...style }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Filters</h4>
      {filters.map(filter => {
        if (filter.type === 'select') {
          return (
            <div key={filter.id} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>{filter.label}</label>
              <select
                value={values[filter.id] || ''}
                onChange={e => onChange(filter.id, e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }}
              >
                <option value="">All</option>
                {filter.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }
        if (filter.type === 'checkbox') {
          return (
            <label key={filter.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={values[filter.id] || false} onChange={e => onChange(filter.id, e.target.checked)} />
              <span style={{ fontSize: 13 }}>{filter.label}</span>
            </label>
          );
        }
        if (filter.type === 'range') {
          return (
            <div key={filter.id} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>{filter.label}</label>
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                value={values[filter.id] || filter.min}
                onChange={e => onChange(filter.id, Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>{filter.min}</span>
                <span>{values[filter.id] || filter.min}</span>
                <span>{filter.max}</span>
              </div>
            </div>
          );
        }
        return null;
      })}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" size="sm" onClick={onApply}>Apply</Button>
        <Button variant="text" size="sm" onClick={onClear}>Clear</Button>
      </div>
    </div>
  );
}
import React from 'react';
import Button from './Button';

interface Step {
  id: string;
  label: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: string;
  onNext?: () => void;
  onPrev?: () => void;
  onComplete?: () => void;
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  loading?: boolean;
}

export default function StepWizard({
  steps,
  currentStep,
  onNext,
  onPrev,
  onComplete,
  children,
  isFirst = false,
  isLast = false,
  loading = false,
}: StepWizardProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: i <= currentIndex ? '#2563eb' : '#e2e8f0',
                  color: i <= currentIndex ? 'white' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 4, color: i <= currentIndex ? '#2563eb' : '#94a3b8' }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 40, height: 2, background: i < currentIndex ? '#2563eb' : '#e2e8f0', margin: '0 8px' }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ minHeight: 200 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {!isFirst && <Button variant="outline" onClick={onPrev} disabled={loading}>Back</Button>}
        <div style={{ flex: 1 }} />
        {!isLast && <Button variant="primary" onClick={onNext} loading={loading}>Continue</Button>}
        {isLast && <Button variant="success" onClick={onComplete} loading={loading}>Complete</Button>}
      </div>
    </div>
  );
}
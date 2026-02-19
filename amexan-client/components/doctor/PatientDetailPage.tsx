'use client';

import { useState } from 'react';
import Tabs from '@/components/common/Tabs';
import Button from '@/components/common/Button';
import PatientOverview from './PatientOverview';
import PatientHistoryEditor from './PatientHistoryEditor';
import PatientClinicalSheet from './PatientClinicalSheet';
import PatientMedications from './PatientMedications';
import PatientLabsImaging from './PatientLabsImaging';
import PatientMessages from './PatientMessages';
import ReferralModal from './ReferralModal';
import TransferAppointmentModal from './TransferAppointmentModal';
import VisitNoteForm from './VisitNoteForm';

export default function PatientDetailPage({ patientData, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showReferral, setShowReferral] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showVisitNote, setShowVisitNote] = useState(false);
  const { patient, measurements, alerts, appointments, visits, labs, messages, medications, imaging } = patientData;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'clinical', label: 'Clinical Sheet' },
    { id: 'medications', label: 'Meds' },
    { id: 'labs', label: 'Labs/Imaging' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{patient.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => setShowVisitNote(true)}>Add Visit Note</Button>
          <Button variant="outline" onClick={() => setShowReferral(true)}>Refer</Button>
          <Button variant="outline" onClick={() => setShowTransfer(true)}>Transfer</Button>
          <Button variant="text" onClick={onBack}>Back</Button>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div style={{ marginTop: 20 }}>
        {activeTab === 'overview' && <PatientOverview patient={patient} measurements={measurements} alerts={alerts} appointments={appointments} />}
        {activeTab === 'history' && <PatientHistoryEditor patientId={patient._id} initialHistory={patientData.history} onUpdate={() => {}} />}
        {activeTab === 'clinical' && <PatientClinicalSheet visits={visits} labs={labs} messages={messages} />}
        {activeTab === 'medications' && <PatientMedications patientId={patient._id} medications={medications} onUpdate={() => {}} />}
        {activeTab === 'labs' && <PatientLabsImaging patientId={patient._id} labs={labs} imaging={imaging} onUpdate={() => {}} />}
        {activeTab === 'messages' && <PatientMessages patientId={patient._id} messages={messages} onUpdate={() => {}} />}
      </div>

      {showReferral && <ReferralModal patientId={patient._id} onClose={() => setShowReferral(false)} onSuccess={() => setShowReferral(false)} />}
      {showTransfer && <TransferAppointmentModal patientId={patient._id} onClose={() => setShowTransfer(false)} onSuccess={() => setShowTransfer(false)} />}
      {showVisitNote && <VisitNoteForm patientId={patient._id} onClose={() => setShowVisitNote(false)} onSuccess={() => setShowVisitNote(false)} />}
    </div>
  );
}
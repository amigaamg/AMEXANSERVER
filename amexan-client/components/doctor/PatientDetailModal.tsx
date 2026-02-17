import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Tabs from '@/components/common/Tabs';
import { api } from '@/lib/utils/api';
import PatientOverview from './PatientOverview';
import PatientHistory from './PatientHistory';
import PatientClinicalSheet from './PatientClinicalSheet';
import PatientMedications from './PatientMedications';
import PatientLabsImaging from './PatientLabsImaging';
import PatientMessages from './PatientMessages';
import PatientReferral from './PatientReferral';
import AppointmentTransfer from './AppointmentTransfer';

interface PatientDetailModalProps {
  patient: any; // basic patient info
  onClose: () => void;
  appointmentId?: string;
}

export default function PatientDetailModal({ patient, onClose, appointmentId }: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient?._id) {
      setLoading(true);
      api(`/api/doctors/patients/${patient._id}`)
        .then(data => setFullData(data))
        .finally(() => setLoading(false));
    }
  }, [patient._id]);

  // Placeholder actions
  const handleWriteNote = () => alert('Write note');
  const handlePrescribe = () => setActiveTab('medications');
  const handleOrderLab = () => setActiveTab('labs');
  const handleRefer = () => setActiveTab('refer');
  const handleTransfer = () => setActiveTab('transfer');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'clinical', label: 'Clinical Sheet' },
    { id: 'medications', label: 'Medications' },
    { id: 'labs', label: 'Labs/Imaging' },
    { id: 'messages', label: 'Messages' },
    { id: 'refer', label: 'Refer' },
    { id: 'transfer', label: 'Transfer' },
  ];

  return (
    <Modal open={!!patient} onClose={onClose} title={`Patient: ${patient.name}`} width={1000}>
      {loading ? (
        <div>Loading patient data...</div>
      ) : fullData ? (
        <>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          <div style={{ marginTop: 20 }}>
            {activeTab === 'overview' && (
              <PatientOverview
                patient={fullData.patient}
                measurements={fullData.measurements || []}
                alerts={fullData.alerts || []}
                appointments={fullData.appointments || []}
                onWriteNote={handleWriteNote}
                onPrescribe={handlePrescribe}
                onOrderLab={handleOrderLab}
                onRefer={handleRefer}
                onTransfer={handleTransfer}
              />
            )}
            {activeTab === 'history' && (
              <PatientHistory patientId={patient._id} />
            )}
            {activeTab === 'clinical' && (
              <PatientClinicalSheet
                visits={fullData.visits || []}
                labs={fullData.labs || []}
                messages={fullData.messages || []}
              />
            )}
            {activeTab === 'medications' && (
              <PatientMedications
                patientId={patient._id}
                medications={fullData.medications || []}
                onUpdate={() => {}}
              />
            )}
            {activeTab === 'labs' && (
              <PatientLabsImaging
                patientId={patient._id}
                labs={fullData.labs || []}
                imaging={fullData.imaging || []}
                onUpdate={() => {}}
              />
            )}
            {activeTab === 'messages' && (
              <PatientMessages
                patientId={patient._id}
                messages={fullData.messages || []}
                onUpdate={() => {}}
              />
            )}
            {activeTab === 'refer' && (
              <PatientReferral
                patientId={patient._id}
                onSuccess={() => { alert('Referral sent'); setActiveTab('overview'); }}
                onCancel={() => setActiveTab('overview')}
              />
            )}
            {activeTab === 'transfer' && (
              <AppointmentTransfer
                appointmentId={appointmentId!}
                patientId={patient._id}
                onClose={() => setActiveTab('overview')}
                onSuccess={() => { alert('Appointment transferred'); onClose(); }}
              />
            )}
          </div>
        </>
      ) : (
        <div>No data found</div>
      )}
    </Modal>
  );
}
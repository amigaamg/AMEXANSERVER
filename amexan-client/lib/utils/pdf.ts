import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Visit, LabResult, Medication } from '@/types/patient';

export const generateClinicalSummary = (visits: Visit[], labs: LabResult[], medications: Medication[], patientName: string) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Clinical Summary - ${patientName}`, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

  // Visits
  doc.setFontSize(14);
  doc.text('Visit History', 14, 45);
  const visitData = visits.map(v => [
    new Date(v.date).toLocaleDateString(),
    v.doctorName || '—',
    v.diagnosis,
    v.treatment,
  ]);
  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Doctor', 'Diagnosis', 'Treatment']],
    body: visitData,
  });

  // Labs (would need finalY handling)
  // ...

  doc.save('clinical-summary.pdf');
};
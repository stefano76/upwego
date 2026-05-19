export interface AuditStep {
  number: number;
  title: string;
  text: string;
}

const auditSteps: AuditStep[] = [
  {
    number: 1,
    title: 'You get in touch',
    text: 'Fill in a short form with your details. We’ll get back to you with a few questions to tailor the audit to your goals.',
  },
  {
    number: 2,
    title: 'We carry out the audit',
    text: 'Once the agreement is signed, a real person reviews your website across all eight areas and writes a clear, detailed report.',
  },
  {
    number: 3,
    title: 'You get a clear report',
    text: 'Plain language findings, a prioritised list of issues, and suggestions on how to fix them. Invoice follows on delivery.',
  },
];

export default auditSteps;
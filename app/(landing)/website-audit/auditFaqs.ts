export interface FaqItem {
  question: string;
  answer: string;
}

const auditFaqs: FaqItem[] = [
  {
    question: 'What happens after I fill in the form?',
    answer: 'We’ll get back to you with a few questions about your website and goals. This helps us tailor the audit to what matters most for your business. Once everything is confirmed, we’ll send a simple agreement to sign. The invoice follows on delivery. No payment is required upfront.',
  },
  {
    question: 'What happens after I receive the report?',
    answer: 'You’ll receive a plain language report with a prioritised list of findings. If you’d like Upwego Digital to carry out any improvements, we’ll send a separate proposal with recommended actions, estimated times and costs. There’s no obligation, you’re free to act on the findings however works best for you.',
  },
  {
    question: 'How is this different from a free online tool?',
    answer: 'Automated tools generate generic reports full of technical jargon that most business owners can’t act on. This audit is carried out by a real person, who validates the findings and documents them in plain language and with specific, prioritised recommendations for your site, not a generic checklist.',
  },
  {
    question: 'Is this a full technical audit?',
    answer: 'This is a professional, thorough review of the areas that matter most for the website of a small or medium-sized business. It’s not a deep-dive specialist report across every page and every line of code, but it gives you a clear, honest picture of where your site stands and what to prioritise. For SMBs, that’s the most valuable starting point.',
  },
  {
    question: 'Do I need to do anything to prepare?',
    answer: 'Just your website URL. We don’t need access to your backend, no passwords, no technical knowledge required on your side. If there’s something specific you’ve been wondering about your site, mention it in the form, we’ll make sure we look at it.',
  },
  {
    question: 'What if my website turns out to be fine?',
    answer: 'The audit will tell you that too, and you’ll have the peace of mind of knowing your site is working as it should. That said, there’s almost always something worth improving, and the report will highlight those opportunities too.',
  },
];

export default auditFaqs;

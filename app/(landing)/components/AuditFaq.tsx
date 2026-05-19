'use client';

import { useState } from 'react';
import type { FaqItem } from '../website-audit/auditFaqs';

export default function AuditFaq({ question, answer, initialOpen = false }: FaqItem & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className="faq-card rounded-lg overflow-hidden border-2 border-brand-secondary bg-brand-tertiary">
      <button
        className="w-full flex items-center justify-between gap-6 p-4 tablet:p-7 text-left cursor-pointer relative"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-xl tablet:text-2xl">{question}</span>
        <span className="text-2xl leading-none flex-shrink-0 text-bodyText select-none">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 tablet:px-7 tablet:pb-6">
            <p className="pt-4 text-bodyText leading-relaxed border-t border-[--border-grey]">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

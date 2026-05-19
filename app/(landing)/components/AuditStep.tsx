import { AuditStep } from '../website-audit/auditSteps';

export default function AuditStepCard({ number, title, text }: AuditStep) {
  return (
    <div className="audit-step bg-brand-secondary/15 rounded-lg p-5 pt-12 relative flex-1 tablet:max-w-md desktop:max-w-none">
      <div className="number flex items-center justify-center w-14 h-14 rounded-[50%] bg-[--blue-numbers] text-white font-semibold absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-2xl font-bold">{number}</span>
      </div>
      <div className="texts flex flex-col gap-4">
        <h4 className="text-xl desktop:text-[22px] font-semibold text-center">{title}</h4>
        <p className="text text-center">{text}</p>
      </div>
      {number < 3 && (
        <>
          <svg className="hidden desktop:block absolute top-1/2 -translate-y-1/2 -right-10 small:-right-16" width="28" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 16H26M26 16L18 8M26 16L18 24" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="desktop:hidden absolute -bottom-9 left-1/2 -translate-x-1/2" width="32" height="28" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6V26M16 26L8 18M16 26L24 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="line absolute bg-[--text-color] left-1/2 -translate-x-1/2 -bottom-10 w-0.5 h-10 
          desktop:bottom-auto desktop:left-auto desktop:top-1/2 desktop:-translate-y-1/2 desktop:-right-[3.75rem] desktop:w-10 
          small:w-16 small:-right-[6rem] desktop:h-0.5"></div>
        </>
      )}
    </div>
  );
}

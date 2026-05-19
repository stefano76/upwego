import Image from 'next/image';
import { AuditArea } from '../website-audit/auditAreas';

export default function AuditCard({ title, icon, iconAlt, problem, text, width }: AuditArea) {
  return (
    <div className="audit-card bg-brand-tertiary rounded-lg">
      <div className="head py-3 px-4 border-b border-[--border-grey] flex items-center gap-3">
        <Image src={icon} alt={iconAlt} width={50} height={50} />
        <h5 className="text-xl desktop:text-[22px] font-semibold">{title}</h5>
      </div>
      <div className="texts p-4 flex flex-col desktop:flex-row gap-4" style={width ? { '--problem-width': `${width}px` } as React.CSSProperties : undefined}>
        <p className={`problem font-light italic desktop:whitespace-pre-line desktop:w-1/2${width ? ' fixedWidth' : ''}`}>{problem}</p>
        <p className={`text desktop:w-1/2${width ? ' fixedWidth' : ''}`}>{text}</p>
      </div>
    </div>
  );
}

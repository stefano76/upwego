'use client';

interface ButtonProps {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ children = 'Request your audit', href = '#final-cta', onClick, className = '', type }: ButtonProps) {
  const base = 'flex items-center justify-center w-[14rem] h-[3.5rem] rounded-lg bg-brand-secondary border-2 border-brand-secondary text-brand-tertiary text-lg font-semibold text-center hover:bg-brand-tertiary hover:text-brand-secondary hover:[color:var(--text-color)] transition-colors duration-300';

  if (href && type !== 'submit') {
    return (
      <a href={href} className={`${base} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type ?? 'button'} onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  );
}

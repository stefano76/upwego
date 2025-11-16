import React from 'react';
import './Button.css';

type ButtonVariant = 'blue' | 'white';

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  href?: never;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonAsAnchorProps extends ButtonBaseProps {
  href: string;
  type?: never;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export default function Button({
  children,
  variant = 'blue',
  className = '',
  disabled = false,
  onClick,
  href,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = variant === 'white' ? 'btn-white' : 'btn-secondary';
  const combinedClasses = className
    ? `${baseClasses} ${className}`.trim()
    : baseClasses;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        onClick={onClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}


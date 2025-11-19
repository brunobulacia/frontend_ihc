import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[var(--color-orange-accent)] hover:bg-[var(--color-orange-hover)] text-[var(--text-white)] shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--background-gray-200)] hover:bg-[var(--background-gray-300)] text-[var(--color-green-text)]',
    outline: 'border-2 border-[var(--color-green-text)] text-[var(--color-green-text)] hover:bg-[var(--color-green-text)]/5',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

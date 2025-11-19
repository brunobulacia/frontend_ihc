import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'green' | 'yellow' | 'red';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200',
    green: 'bg-[#D5E8E0] border-2 border-[#A8C9BC]',
    yellow: 'bg-[#FFF4E0] border-2 border-[#FFE4A8]',
    red: 'bg-[#FFE5E5] border-2 border-[#FFB8B8]',
  };
  
  return (
    <div className={`rounded-2xl p-6 shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

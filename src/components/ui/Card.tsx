import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`
      bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/40
      shadow-sm ${hover ? 'hover:shadow-md hover:border-nexora-200 dark:hover:border-nexora-800 hover:-translate-y-0.5 transition-all duration-300' : ''}
      ${paddings[padding]} ${className}
    `}>
      {children}
    </div>
  );
}


import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, variant = 'default', onClick }) => {
  return (
    <div 
      className={cn(
        'rounded-lg p-4 transition-all duration-200 animate-scale-in',
        variant === 'default' ? 'bg-white shadow-sm border border-cargo-gray' : 'glass-morphism',
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

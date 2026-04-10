import React from 'react';
import { cn } from '@/src/lib/utils';

export const Badge = ({ children, className, variant = 'blue' }: { children: React.ReactNode, className?: string, variant?: string }) => {
  const variants: Record<string, string> = {
    blue: 'bg-hunter-blue/10 text-hunter-blue',
    gold: 'bg-hunter-gold/10 text-hunter-gold',
    green: 'bg-hunter-green/10 text-hunter-green',
    purple: 'bg-hunter-purple/10 text-hunter-purple',
    red: 'bg-hunter-red/10 text-hunter-red',
    cyan: 'bg-hunter-cyan/10 text-hunter-cyan',
  };
  return (
    <span className={cn('hunter-badge', variants[variant], className)}>
      {children}
    </span>
  );
};

export const Card = ({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) => {
  const variants: Record<string, string> = {
    blue: 'border-hunter-blue/30 shadow-[0_0_20px_rgba(79,142,247,0.05)]',
    gold: 'border-hunter-gold/30 shadow-[0_0_20px_rgba(245,166,35,0.05)]',
    green: 'border-hunter-green/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]',
    purple: 'border-hunter-purple/30 shadow-[0_0_20px_rgba(176,110,243,0.05)]',
    red: 'border-hunter-red/30',
  };
  return (
    <div className={cn('hunter-card', variant && variants[variant], className)}>
      {children}
    </div>
  );
};

export const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('text-[9px] tracking-[2.5px] uppercase text-hunter-text3 my-3 flex items-center gap-1.5', className)}>
    <div className="w-[3px] h-[11px] bg-hunter-blue rounded-[2px] shrink-0" />
    {children}
  </div>
);

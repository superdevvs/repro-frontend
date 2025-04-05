
import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className = '' }: ShellProps) {
  return (
    <div className={`p-4 md:p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  );
}

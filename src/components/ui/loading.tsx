import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, children, className }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading = false, children, disabled, ...props }) => {
  return (
    <button disabled={disabled || loading} {...props}>
      <div className="flex items-center justify-center">
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </div>
    </button>
  );
};

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 animate-pulse rounded-full bg-current" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 animate-pulse rounded-full bg-current" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 animate-pulse rounded-full bg-current" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export { LoadingSpinner, LoadingOverlay, LoadingButton, LoadingDots };

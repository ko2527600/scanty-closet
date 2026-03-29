import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'primary' | 'white' | 'silver';
}

export function Spinner({ size = 'md', className, variant = 'primary' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const variants = {
    primary: 'border-brand-red/30 border-t-brand-red',
    white: 'border-white/20 border-t-white',
    silver: 'border-brand-silver/20 border-t-brand-silver',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizes[size],
        variants[variant],
        className
      )}
    />
  );
}

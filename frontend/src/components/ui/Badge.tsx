import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'error' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-brand-red text-white border-transparent',
    secondary: 'bg-brand-silver/10 text-brand-silver border-white/5',
    outline: 'bg-transparent text-brand-silver border-white/20',
    success: 'bg-brand-green/20 text-brand-green border-brand-green/30',
    danger: 'bg-red-500/20 text-red-500 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {children}
    </span>
  );
}

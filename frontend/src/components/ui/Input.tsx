import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-brand-silver/70 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white ring-offset-brand-darkgrey transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-silver/30 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red/30 disabled:cursor-not-allowed disabled:opacity-50 blur-sm hover:blur-none focus:blur-none',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 ml-1 italic">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

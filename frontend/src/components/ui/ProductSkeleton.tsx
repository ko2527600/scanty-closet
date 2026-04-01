import { cn } from '../../lib/utils';

interface ProductSkeletonProps {
  className?: string;
}

export function ProductSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn(
      'bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden animate-pulse',
      className
    )}>
      {/* Image Placeholder */}
      <div className="aspect-[4/5] bg-white/5" />
      
      {/* Content Placeholder */}
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
        <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

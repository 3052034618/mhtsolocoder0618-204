import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-sand-100 text-sand-700',
      success: 'bg-forest-100 text-forest-700',
      warning: 'bg-candle/20 text-pottery',
      danger: 'bg-clay-100 text-clay-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

export default Tag;

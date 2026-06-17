import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in',
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-sand-100 flex items-center justify-center mb-6">
        <Icon size={36} className="text-sand-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-sand-900 font-serif mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sand-600 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;

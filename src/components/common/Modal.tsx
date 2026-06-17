import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-sand-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-hover z-10 overflow-hidden',
          sizes[size],
          'animate-fade-in-up'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-100">
          {title && (
            <h3 className="text-xl font-semibold text-sand-900 font-serif">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-xl text-sand-500 hover:text-sand-700 hover:bg-sand-100 transition-colors',
              !title && 'ml-auto'
            )}
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

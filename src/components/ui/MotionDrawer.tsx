import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

type MotionDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'left' | 'right';
  width?: number;
  className?: string;
  children: ReactNode;
};

export function MotionDrawer({ isOpen, onClose, direction = 'left', width = 360, className = '', children }: MotionDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const side = direction === 'left' ? 'left-0' : 'right-0';
  const hiddenTransform = direction === 'left' ? '-translate-x-full' : 'translate-x-full';

  return createPortal(
    <div className={`fixed inset-0 z-[70] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ width }}
        className={`absolute top-0 ${side} h-full max-w-full overflow-y-auto bg-linen shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : hiddenTransform
        } ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

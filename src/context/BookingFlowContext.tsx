import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type BookingFlowContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const BookingFlowContext = createContext<BookingFlowContextValue | null>(null);

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingFlowContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </BookingFlowContext.Provider>
  );
}

export function useBookingFlow() {
  const ctx = useContext(BookingFlowContext);
  if (!ctx) throw new Error('useBookingFlow must be used within a BookingFlowProvider');
  return ctx;
}

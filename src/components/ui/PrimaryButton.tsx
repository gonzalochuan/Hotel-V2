import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

type PrimaryButtonProps = {
  children: ReactNode;
  href: string;
  variant?: 'dark' | 'light';
  onClick?: () => void;
};

export function PrimaryButton({ children, href, variant = 'dark', onClick }: PrimaryButtonProps) {
  const styles =
    variant === 'dark'
      ? 'bg-ink text-linen hover:bg-palm'
      : 'bg-linen text-ink hover:bg-sun';

  return (
    <a
      className={`inline-flex min-h-[52px] items-center gap-3 rounded-full px-7 py-3 text-base font-bold transition ${styles}`}
      href={href}
      onClick={
        onClick
          ? (event) => {
              event.preventDefault();
              onClick();
            }
          : undefined
      }
    >
      {children}
      <ArrowUpRight className="text-sun" size={20} strokeWidth={2} />
    </a>
  );
}

import { ArrowUpRight, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { brandName, navigationItems } from '../../constants/landingContent';
import { useBookingFlow } from '../../context/BookingFlowContext';
import { useAuth } from '../../context/AuthContext';
import { MotionDrawer } from '../ui/MotionDrawer';
import { PrimaryButton } from '../ui/PrimaryButton';
import { AccountDrawer } from './AccountDrawer';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { open: openBooking } = useBookingFlow();
  const { session } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled ? 'border-ink/10 bg-linen/76 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
        <a href="#" className="flex items-center gap-3" aria-label="Delightful Philippines home">
          <img className="h-14 w-14 object-contain sm:h-16 sm:w-16" src="/image/dphlogo.png" alt="" />
          <span
            className="brand-write hidden font-brand text-2xl font-normal tracking-normal text-ink sm:block"
            aria-hidden="true"
          >
            {brandName.split('').map((char, index) => (
              <span key={index} className="brand-letter" style={{ animationDelay: `${index * 0.05}s` }}>
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </span>
        </a>

        <nav className="hidden items-center gap-8 rounded-full border border-ink px-7 py-3 text-sm font-medium text-ink backdrop-blur lg:flex">
          {navigationItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-palm">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#homes"
            onClick={(event) => {
              event.preventDefault();
              openBooking();
            }}
            className="hidden h-12 items-center gap-3 rounded-full border border-ink px-7 text-base font-medium text-ink transition hover:bg-ink hover:text-linen sm:flex"
          >
            Browse Stays
            <ArrowUpRight size={19} strokeWidth={1.8} />
          </a>
          <button
            className={`grid h-12 w-12 place-items-center rounded-full border transition ${
              session ? 'border-ink bg-ink text-linen hover:bg-palm' : 'border-ink text-ink hover:bg-ink hover:text-linen'
            }`}
            type="button"
            aria-label="Account"
            onClick={() => setIsAccountOpen(true)}
          >
            <User size={20} strokeWidth={1.8} />
          </button>
          <button
            className="grid h-12 w-12 place-items-center rounded-full bg-ink text-linen transition hover:bg-palm"
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={23} strokeWidth={2} />
          </button>
        </div>
      </div>

      <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      <MotionDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} direction="right" width={420}>
        <div className="flex h-full flex-col p-8 sm:p-10">
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="flex items-center gap-3"
              aria-label="Delightful Philippines home"
              onClick={() => setIsMenuOpen(false)}
            >
              <img className="h-11 w-11 object-contain" src="/image/dphlogo.png" alt="" />
              <span className="font-brand text-xl font-normal text-ink">{brandName}</span>
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-ink hover:text-linen"
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <nav className="mt-14 flex flex-col">
            {navigationItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between border-b border-ink/10 py-5 text-3xl font-light uppercase leading-none text-ink transition hover:text-palm sm:text-4xl"
              >
                {item}
                <ArrowUpRight
                  className="text-ink/25 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-palm"
                  size={24}
                  strokeWidth={1.8}
                />
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-5 pt-10">
            <PrimaryButton
              href="#homes"
              onClick={() => {
                setIsMenuOpen(false);
                openBooking();
              }}
            >
              Browse Stays
            </PrimaryButton>
            <a
              href="mailto:hello@delightful.ph"
              className="text-sm pl-4 text-ink/60 underline decoration-ink/25 underline-offset-4 transition hover:text-palm"
            >
              hello@delightful.ph
            </a>
          </div>
        </div>
      </MotionDrawer>
    </header>
  );
}

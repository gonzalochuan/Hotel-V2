import { PenLine } from 'lucide-react';
import { footerContent } from '../../constants/landingContent';
import { resolveIcon } from '../../data/icons';

const { exploreLinks, legalLinks, affiliations } = footerContent;
const socialLinks = footerContent.socialLinks.map((social) => ({ ...social, Icon: resolveIcon(social.icon) }));

export function Footer() {
  return (
    <footer className="bg-linen text-ink">
      <div className="flex flex-col items-center gap-8 px-5 py-28 text-center sm:px-8 lg:px-14">
        <h2 className="font-brand text-5xl font-normal text-ink/85 sm:text-6xl">Delightful Newsletter</h2>
        <a
          href="#newsletter"
          className="inline-flex h-14 items-center gap-2 rounded-full border border-ink/25 px-7 text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-ink hover:text-linen"
        >
          <PenLine size={16} strokeWidth={2} />
          Sign Up
        </a>
      </div>

      <div className="border-t border-ink/12 px-5 py-16 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1680px] gap-12 text-sm sm:grid-cols-3">
          <ul className="flex flex-col gap-3 font-bold uppercase tracking-[0.08em]">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <a className="underline decoration-ink/30 underline-offset-4 transition hover:text-palm" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 transition hover:border-ink hover:bg-ink hover:text-linen"
                >
                  <social.Icon size={17} strokeWidth={1.8} />
                </a>
              ))}
            </div>
            <a
              className="font-bold uppercase tracking-[0.08em] underline decoration-ink/30 underline-offset-4 transition hover:text-palm"
              href="#about"
            >
              Contact Us
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 leading-6 text-ink/75 sm:items-end sm:text-right">
            <p>Delightful Philippines HQ</p>
            <p>San Isidro, General Santos City</p>
            <p>General Santos City, Philippines</p>
            <a className="underline decoration-ink/30 underline-offset-4 hover:text-palm" href="tel:+6328123456">
              +0000000000
            </a>
            <a className="font-bold uppercase tracking-[0.08em] underline decoration-ink/30 underline-offset-4 hover:text-palm" href="#">
              Google Maps
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1680px] flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {affiliations.map((name) => (
            <span key={name} className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/12 px-5 py-6 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1680px] flex-col-reverse items-center gap-4 text-xs text-ink/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Delightful Philippines. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((label) => (
              <a key={label} className="underline decoration-ink/25 underline-offset-4 hover:text-palm" href="#">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

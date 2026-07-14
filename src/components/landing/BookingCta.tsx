import { bookingProcessSteps } from '../../constants/landingContent';
import { useBookingFlow } from '../../context/BookingFlowContext';
import { resolveIcon } from '../../data/icons';
import { PrimaryButton } from '../ui/PrimaryButton';

const bookingSteps = bookingProcessSteps.map((step) => ({ ...step, Icon: resolveIcon(step.icon) }));

export function BookingCta() {
  const { open } = useBookingFlow();

  return (
    <section className="bg-linen px-5 py-24 text-ink sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex flex-col gap-8 border-t border-ink/12 pt-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-palm">Booking flow</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-light uppercase leading-none sm:text-7xl">
              Four steps to arrival
            </h2>
          </div>
          <PrimaryButton href="#homes" onClick={open}>
            Start Exploring
          </PrimaryButton>
        </div>

        <div className="mt-14 grid gap-10 border-y border-ink/12 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ink/12">
          {bookingSteps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-start gap-5 lg:px-8 lg:first:pl-0">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sun text-ink">
                <step.Icon size={22} strokeWidth={1.8} />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-1 text-xl font-medium leading-6">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

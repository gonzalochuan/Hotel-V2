import { heroTrailImages } from '../../constants/landingContent';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ImageMouseTrail } from '../ui/ImageMouseTrail';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linen text-ink lg:min-h-screen">
      <ImageMouseTrail
        items={heroTrailImages}
        maxNumberOfImages={5}
        distance={45}
        imgClassName="h-36 w-28 rounded-2xl sm:h-48 sm:w-40"
        className="absolute inset-0"
      >
        <div className="relative z-10 mx-auto max-w-[1680px] px-5 pb-10 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-14 lg:pt-40">
          <p className="mb-7 max-w-2xl text-sm font-bold uppercase tracking-[0.34em] text-palm">
            Island stays with Filipino warmth
          </p>
          <h1 className="max-w-[1400px] text-[clamp(2.75rem,7vw,7.5rem)] font-light uppercase leading-[0.98] tracking-normal">
            <span className="block">Stay</span>
            <span className="flex flex-wrap gap-x-10 gap-y-2">
              <span>Under One</span>
              <span className="max-w-xs text-base font-display normal-case leading-7 tracking-normal text-ink/60">
                Seaside villas, calm suites, and curated local experiences made for slow mornings and golden evenings.
              </span>
            </span>
            <span className="block">Unforgettable Sky</span>
          </h1>
          <div className="mt-10">
            <PrimaryButton href="#homes">Find Your Stay</PrimaryButton>
          </div>
        </div>
      </ImageMouseTrail>
    </section>
  );
}

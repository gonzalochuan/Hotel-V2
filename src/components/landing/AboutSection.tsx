import { amenities } from '../../constants/landingContent';

export function AboutSection() {
  return (
    <section id="about" className="bg-linen px-5 py-28 text-ink sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1680px]">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-palm">About the stay</p>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <h2 className="text-5xl font-light uppercase leading-[0.96] sm:text-7xl lg:text-8xl">
            A <span className="font-brand text-palm normal-case">softer</span> way to
            discover the Philippines
          </h2>
          <p className="max-w-xl text-lg leading-8 text-ink/68 lg:pb-2">
            Delightful Philippines brings together warm hospitality, design-led rooms, and local guidance so every
            guest can move from arrival to island rhythm with ease.
          </p>
        </div>

        <div className="mt-16 grid divide-y divide-ink/12 border-y border-ink/12 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {amenities.map((amenity, index) => (
            <div key={amenity} className="flex flex-col gap-6 py-8 pr-6 sm:px-8 sm:first:pl-0">
              <span className="font-brand text-3xl text-ink/35">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-xl font-medium leading-6">{amenity}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

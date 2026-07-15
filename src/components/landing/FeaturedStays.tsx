import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useBookingFlow } from '../../context/BookingFlowContext';
import { featuredStayPanels, type FeaturedStayPanel } from '../../constants/landingContent';

type VideoPanel = Extract<FeaturedStayPanel, { type: 'video' }>;

const panels = featuredStayPanels;

function PanelOverlay({ label, onDiscover }: { label: string; onDiscover: () => void }) {
  return (
    <a
      href="#homes"
      className="group absolute inset-0 block"
      onClick={(event) => {
        event.preventDefault();
        onDiscover();
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
      <span className="absolute inset-0 grid place-items-center px-6 text-center font-brand text-[4rem] leading-none text-linen sm:text-[5rem] lg:text-[6.5rem]">
        {label}
      </span>
      <span className="absolute bottom-36 left-24 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.28em] text-linen underline underline-offset-4 transition group-hover:gap-3">
        Discover
        <ArrowUpRight size={16} strokeWidth={2} />
      </span>
    </a>
  );
}

function VideoStackPanel({
  panel,
  zIndex,
  onDiscover,
  id,
}: {
  panel: VideoPanel;
  zIndex: number;
  onDiscover: () => void;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(([entry]) => setIsNear(entry.isIntersecting), {
      rootMargin: '100% 0px 100% 0px',
    });
    const visibleObserver = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.4,
    });

    nearObserver.observe(el);
    visibleObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <div id={id} ref={containerRef} className="group sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex }}>
      {isNear ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={panel.src}
          preload="none"
          loop
          muted
          playsInline
        />
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}
      <PanelOverlay label={panel.label} onDiscover={onDiscover} />
    </div>
  );
}

export function FeaturedStays() {
  const { open } = useBookingFlow();

  return (
    <section id="homes" className="relative bg-[#fbfaf4] text-ink">
      {panels.map((panel, index) =>
        panel.type === 'split' ? (
          <div
            key={`split-${index}`}
            id={panel.items.some((item) => item.label === 'Suites') ? 'suites' : undefined}
            className="sticky top-0 flex h-screen w-full flex-col overflow-hidden sm:flex-row"
            style={{ zIndex: index + 1 }}
          >
            {panel.items.map((item) => (
              <div key={item.label} className="group relative h-1/2 w-full overflow-hidden sm:h-full sm:w-1/2">
                <img
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  src={item.image}
                  alt={item.label}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <PanelOverlay label={item.label} onDiscover={open} />
              </div>
            ))}
          </div>
        ) : (
          <VideoStackPanel
            key={`video-${index}`}
            panel={panel}
            zIndex={index + 1}
            onDiscover={open}
            id={panel.label === 'Experience' ? 'experiences' : undefined}
          />
        ),
      )}
    </section>
  );
}

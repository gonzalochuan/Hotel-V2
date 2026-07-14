import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

type TrailImage = {
  id: number;
  x: number;
  y: number;
  src: string;
  rotate: number;
};

type ImageMouseTrailProps = {
  items: string[];
  maxNumberOfImages?: number;
  distance?: number;
  imgClassName?: string;
  className?: string;
  children?: ReactNode;
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function ImageMouseTrail({
  items,
  maxNumberOfImages = 5,
  distance = 25,
  imgClassName = 'h-36 w-28 sm:h-48 sm:w-40',
  className = '',
  children,
}: ImageMouseTrailProps) {
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const pendingPointRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const idRef = useRef(0);

  const spawnAt = useCallback(
    (x: number, y: number) => {
      const src = items[indexRef.current % items.length];
      indexRef.current += 1;
      const id = idRef.current;
      idRef.current += 1;

      setTrail((current) => {
        const next = [...current, { id, x, y, src, rotate: (Math.random() - 0.5) * 16 }];
        return next.length > maxNumberOfImages ? next.slice(next.length - maxNumberOfImages) : next;
      });
    },
    [items, maxNumberOfImages],
  );

  const processPending = useCallback(() => {
    rafRef.current = null;
    const point = pendingPointRef.current;
    if (!point) return;

    const last = lastPointRef.current;
    if (last && Math.hypot(point.x - last.x, point.y - last.y) < distance) return;
    lastPointRef.current = point;
    spawnAt(point.x, point.y);
  }, [distance, spawnAt]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      pendingPointRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(processPending);
      }
    },
    [processPending],
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const removeItem = useCallback((id: number) => {
    setTrail((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    items.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [items]);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className={`relative ${className}`}>
      {trail.map((item) => (
        <TrailImageItem key={item.id} item={item} imgClassName={imgClassName} onDone={() => removeItem(item.id)} />
      ))}
      {children}
    </div>
  );
}

function TrailImageItem({
  item,
  imgClassName,
  onDone,
}: {
  item: TrailImage;
  imgClassName: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('visible')));
    const exitTimer = setTimeout(() => setPhase('exit'), 550);
    const removeTimer = setTimeout(onDone, 950);
    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onDone]);

  const scale = phase === 'enter' ? 0.5 : phase === 'exit' ? 0.94 : 1;

  return (
    <img
      src={item.src}
      alt=""
      decoding="async"
      className={`pointer-events-none absolute rounded-2xl object-cover shadow-soft ${imgClassName}`}
      style={{
        left: item.x,
        top: item.y,
        transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${scale})`,
        opacity: phase === 'exit' ? 0 : 1,
        willChange: 'transform, opacity',
        transition: `transform 550ms ${EASE}, opacity ${phase === 'exit' ? '400ms' : '350ms'} ${EASE}`,
      }}
    />
  );
}

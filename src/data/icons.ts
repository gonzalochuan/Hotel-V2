import {
  BedDouble,
  Bluetooth,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Coffee,
  Compass,
  Facebook,
  Instagram,
  Linkedin,
  Maximize2,
  Mountain,
  PawPrint,
  Sparkles,
  Tv,
  Usb,
  Wifi,
  Wine,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BedDouble,
  Bluetooth,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Coffee,
  Compass,
  Facebook,
  Instagram,
  Linkedin,
  Maximize2,
  Mountain,
  PawPrint,
  Sparkles,
  Tv,
  Usb,
  Wifi,
  Wine,
};

export function resolveIcon(name: string): LucideIcon {
  const icon = iconMap[name];
  if (!icon) {
    throw new Error(`Unknown icon name in content data: ${name}`);
  }
  return icon;
}

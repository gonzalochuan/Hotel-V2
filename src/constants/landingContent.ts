import content from '../data/content.json';

export type FeaturedStayPanel =
  | { type: 'split'; items: { label: string; image: string }[] }
  | { type: 'video'; label: string; src: string };

export const brandName = content.brandName;
export const navigationItems = content.navigationItems;
export const amenities = content.amenities;
export const heroTrailImages = content.heroTrailImages;
export const featuredStayPanels = content.featuredStayPanels as FeaturedStayPanel[];
export const bookingProcessSteps = content.bookingProcessSteps;
export const bookingFlowSteps = content.bookingFlowSteps;
export const footerContent = content.footer;

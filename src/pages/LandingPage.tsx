import { BookingFlow } from '../components/booking/BookingFlow';
import { AboutSection } from '../components/landing/AboutSection';
import { BookingCta } from '../components/landing/BookingCta';
import { FeaturedStays } from '../components/landing/FeaturedStays';
import { HeroSection } from '../components/landing/HeroSection';
import { Footer } from '../components/layout/Footer';
import { SiteHeader } from '../components/layout/SiteHeader';
import { BookingFlowProvider } from '../context/BookingFlowContext';

export function LandingPage() {
  return (
    <BookingFlowProvider>
      <div className="min-h-screen bg-linen font-display">
        <SiteHeader />
        <main>
          <HeroSection />
          <FeaturedStays />
          <AboutSection />
          <BookingCta />
        </main>
        <Footer />
      </div>
      <BookingFlow />
    </BookingFlowProvider>
  );
}

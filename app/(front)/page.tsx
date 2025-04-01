// File: app/(front)/page.tsx
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database } from 'lucide-react';
import { Hero } from '@/components/landing-page/hero/hero';
//import { TimelineSection } from '@/components/landing-page/timeline/TimelineSection'; 
import PricingPage from './pricing/page';
import { Footer } from '@/components/landing-page/footer/footer'; // <-- CORRECTED import name

export default function HomePage() {
  return (
    <main>
      <section>
        <Hero />
      </section>

       {/*<section>
        <TimelineSection />
      </section>*/} 

      <section>
        <PricingPage />
      </section>
      
      <Footer /> {/* <-- CORRECTED component usage name */}
    </main>
  );
}


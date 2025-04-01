// File: app/(front)/page.tsx
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database } from 'lucide-react';
import { Hero } from '@/components/landing-page/hero/hero';
import { TimelineSection } from '@/components/landing-page/timeline/TimelineSection'; 
import PricingPage from './pricing/page'; // Correct import path
import { Footer } from '@/components/landing-page/footer/footer'; 

export default function HomePage() {
  return (
    <main>
      <section>
        <Hero />
      </section>

       <section>
        <TimelineSection />
      </section> 

      {/* --- MODIFIED: Added id --- */}
      <section id="pricing-section"> 
        <PricingPage />
      </section>
      
      <Footer /> 
    </main>
  );
}
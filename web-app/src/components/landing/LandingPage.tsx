import React from 'react';
import Hero from './Hero';
import MovingStrip from './MovingStrip';
import ProcessSection from './ProcessSection';
import FeaturesSection from './FeaturesSection';
import InsightsSection from './InsightsSection';
import CollectionSection from './CollectionSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Hero />
      <MovingStrip />
      <ProcessSection />
      <FeaturesSection />
      <InsightsSection />
      <CollectionSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
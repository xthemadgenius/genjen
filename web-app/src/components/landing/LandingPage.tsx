import React from 'react';
import Hero from './Hero';
import MovingStrip from './MovingStrip';
import ProcessSection from './ProcessSection';
import FeaturesSection from './FeaturesSection';
import InsightsSection from './InsightsSection';
import CollectionSection from './CollectionSection';

const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <MovingStrip />
      <ProcessSection />
      <FeaturesSection />
      <InsightsSection />
      <CollectionSection />
    </main>
  );
};

export default LandingPage;
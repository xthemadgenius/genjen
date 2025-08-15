import React from 'react';
import Hero from './Hero';
import MovingStrip from './MovingStrip';
import ProcessSection from './ProcessSection';

const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <MovingStrip />
      <ProcessSection />
    </main>
  );
};

export default LandingPage;
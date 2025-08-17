"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/Hero.module.css';

const Hero = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <section className={styles.hero} role="banner">
      {/* Navigation */}
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon} aria-hidden="true">
              <span>J</span>
            </div>
            <span className={styles.logoText}>JenGen AI</span>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
          
          {/* Navigation Links */}
          <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navLinksOpen : ''}`} id="mobile-navigation">
            <a href="#about" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#projects" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
            <a href="#courses" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Courses</a>
            <a href="#mentors" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Mentors</a>
            <a href="#community" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Community</a>
            
            {/* Mobile Login Button */}
            <button 
              className={styles.mobileLoginButton} 
              onClick={() => {
                handleLoginClick();
                setIsMobileMenuOpen(false);
              }}
              aria-label="Log in to your account"
            >
              Log in
            </button>
          </div>
          
          {/* Login Button */}
          <button 
            className={styles.loginButton} 
            onClick={handleLoginClick}
            aria-label="Log in to your account"
          >
            Log in
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        {/* Floating 3D Orbs - Decorative Only */}
        <div className={styles.decorativeIcons} aria-hidden="true">
          <div className={styles.floatingOrb}>
            <span style={{ fontSize: '1.5rem' }}>$</span>
          </div>
          <div className={styles.floatingOrb}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div className={styles.floatingOrb}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Main Title */}
        <div className={styles.title}>
          <h1 className={styles.titleText}>
            Discover <span className={styles.titleUnique}>JenGen</span> AI
          </h1>
        </div>

        {/* Cards Container */}
        <div className={styles.cardsContainer}>
          <div className={styles.donationCardLeft}>
            <div className={styles.donationCard}>
              <div className={`${styles.donationAvatar} ${styles.avatarAnna}`}></div>
              <div className={styles.donationInfo}>
                <h3>Where Wisdom</h3>
                <p>Meets Innovation</p>
              </div>
            </div>
          </div>

          {/* Right Donation Card - Jane Holand */}
          <div className={styles.donationCardRight}>
            <div className={styles.donationCard}>
              <div className={`${styles.donationAvatar} ${styles.avatarJane}`}></div>
              <div className={styles.donationInfo}>
                <h3>Where Legacy</h3>
                <p>Meets Possibility</p>
              </div>
            </div>
          </div>

          {/* Futuristic Hero Image */}
          <div className={styles.mainCard}>
            <div className={styles.cardContainer}>
              <div className={styles.cardBackground}>
                {/* Hero Image Base */}
                <div className={styles.heroImage}>
                  {/* Sunset Glow */}
                  <div className={styles.sunsetGlow}></div>
                  
                  {/* Architectural Pillars */}
                  <div className={styles.architecturalPillars}>
                    <div className={styles.pillar}></div>
                    <div className={styles.pillar}></div>
                    <div className={styles.pillar}></div>
                    <div className={styles.pillar}></div>
                  </div>
                  
                  {/* Natural Landscape */}
                  <div className={styles.landscape}>
                    {/* Mountains */}
                    <div className={styles.mountains}>
                      <svg viewBox="0 0 400 100" className="w-full h-full">
                        <polygon points="0,100 80,20 140,60 200,30 260,50 320,25 400,45 400,100" 
                                fill="rgba(99, 102, 241, 0.3)"/>
                        <polygon points="0,100 60,40 120,70 180,45 240,65 300,40 360,55 400,50 400,100" 
                                fill="rgba(139, 92, 246, 0.2)"/>
                      </svg>
                    </div>
                    
                    {/* Grass Field */}
                    <div className={styles.grassField}></div>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className={styles.contentOverlay}>
                  {/* ESG Description */}
                  <div className={styles.esgDescription}>
                    <p>
                    Where generations come together to build something better 
                    than we ever could alone.
                    </p>
                  </div>

                  {/* Mint Button */}
                  <button className={styles.mintButton}>
                    Join now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
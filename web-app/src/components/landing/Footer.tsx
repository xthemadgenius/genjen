import React from 'react';
import styles from './css/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Logo and Social Icons */}
          <div className={styles.leftSection}>
            {/* Logo */}
            <div className={styles.logo}>
              <img 
                src="/jengenwhite.png" 
                alt="JenGen AI" 
                className={styles.logoImage}
              />
              <span className={styles.logoText}>JenGen AI</span>
            </div>
            
            {/* Social Icons */}
            <div className={styles.socialIcons}>
              {/* Telegram */}
              <a href="#" className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              
              {/* Discord */}
              <a href="#" className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              
              {/* Twitter */}
              <a href="#" className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26l8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Center - Link Columns */}
          <nav className={styles.linkColumns} aria-label="Footer navigation">
            {/* Column 1 - Platform */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnHeader}>Platform</h4>
              <a href="#" className={styles.footerLink}>Wisdom Collection</a>
              <a href="#" className={styles.footerLink}>Bridge Builder</a>
              <a href="#" className={styles.footerLink}>Community Hub</a>
              <a href="#" className={styles.footerLink}>Mentorship</a>
            </div>
            
            {/* Column 2 - Connect */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnHeader}>Connect</h4>
              <a href="#" className={styles.footerLink}>Newsletter</a>
              <a href="#" className={styles.footerLink}>LinkedIn</a>
              <a href="#" className={styles.footerLink}>YouTube</a>
              <a href="#" className={styles.footerLink}>Discord</a>
              <a href="#" className={styles.footerLink}>Twitter</a>
            </div>
            
            {/* Column 3 - Resources */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnHeader}>Resources</h4>
              <a href="#" className={styles.footerLink}>Contact</a>
              <a href="#" className={styles.footerLink}>Wisdom Stories</a>
              <a href="#" className={styles.footerLink}>Privacy + Terms</a>
              <a href="#" className={styles.footerLink}>About JenGen AI</a>
              <a href="#" className={styles.footerLink}>Generational Impact</a>
            </div>
          </nav>
        </div>
        
        {/* Bottom Copyright */}
        <div className={styles.copyright}>
          © 2025 JenGen AI. Bridging Generations Through Wisdom & Technology.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
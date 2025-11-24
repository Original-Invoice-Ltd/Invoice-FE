import React from 'react';
import Image from 'next/image';
import Header from '../header';
import HeroSection from './HeroSection';
import VisionMissionSection from './VisionMissionSection';
import CoreValuesSection from './CoreValuesSection';
import TeamSection from './TeamSection';
import Footer from '../footer/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* This wrapper allows inner content to overflow visually */}
      {/* but prevents horizontal scrollbar on the entire page */}
      <div className="relative overflow-x-hidden">
        <div
          className="mx-auto w-full relative"
          style={{
            maxWidth: '1440px',
            background: '#FFFFFF',
          }}
        >
          {/* Top Right Eclipse — NOW FIXED & BEAUTIFUL */}
          <Image
            src="/assets/top right eclipse.svg"
            alt=""
            width={600}
            height={600}
            className="absolute top-0 right-0 pointer-events-none z-10 select-none"
            style={{
              // Pushes it far right but keeps anchor point inside viewport
              transform: 'translateX(35%)',
              // Optional: slight rotate or scale if your design needs it
              // transform: 'translateX(35%) rotate(15deg)',
            }}
            priority
          />

          {/* Header stays above the ellipse */}
          <div className="relative z-20">
            <Header />
          </div>

          <HeroSection />

          {/* Mid Right Eclipse (you had left-0 — assuming you meant mid-left) */}
          <Image
            src="/assets/Mid Right Ellipse.svg"
            alt=""
            width={300}
            height={300}
            className="absolute pointer-events-none z-0 select-none"
            style={{ 
              top: '600px', 
              left: '-100px', 
              transform: 'translateX(-40%)' // optional: more overflow control
            }}
          />

          <VisionMissionSection />
          <CoreValuesSection />
          <TeamSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
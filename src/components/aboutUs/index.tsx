import React from 'react';
import Header from '../header';
import HeroSection from './HeroSection';
import VisionMissionSection from './VisionMissionSection';
import CoreValuesSection from './CoreValuesSection';
import TeamSection from './TeamSection';
import Footer from '../footer/Footer';

const AboutUs: React.FC = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: '#EAEBEF',
        border: '1px solid #0000001A',
        borderRadius: '2px',
        opacity: 1
      }}
    >
      <div 
        className="mx-auto w-full"
        style={{
          maxWidth: '1440px',
          background: '#FFFFFF',
          opacity: 1,
          overflowX: 'hidden'
        }}
      >
        <Header />
        <HeroSection />
        <VisionMissionSection />
        <CoreValuesSection />
        <TeamSection />
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;

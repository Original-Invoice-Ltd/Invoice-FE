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
      <div 
        className="mx-auto w-full relative"
        style={{
          maxWidth: '1440px',
          background: '#FFFFFF',
          opacity: 1,
          overflow: 'visible'
        }}
      >
        {/* Top Right Eclipse - Top Right Corner */}
        <Image
          src="/assets/top right eclipse.svg"
          alt=""
          width={600}
          height={600}
          className="absolute top-0 right-0 translate-x-[20%] pointer-events-none z-10"
        />
        
        <div className="relative z-20">
          <Header />
        </div>
        
        <HeroSection />
        
        {/* Mid Right Eclipse - Below Hero Section */}
        <Image
          src="/assets/Mid Right Ellipse.svg"
          alt=""
          width={300}
          height={300}
          className="absolute left-0 pointer-events-none z-0"
          style={{ top: '600px' }}
        />
        
        <VisionMissionSection />
        <CoreValuesSection />
        <TeamSection />
        
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;

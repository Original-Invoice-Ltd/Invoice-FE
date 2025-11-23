import React from 'react';
import Header from '../header';
import HeroSection from './HeroSection';
import VisionMissionSection from './VisionMissionSection';
import CoreValuesSection from './CoreValuesSection';
import TeamSection from './TeamSection';
import Footer from '../footer/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <VisionMissionSection />
      <CoreValuesSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default AboutUs;

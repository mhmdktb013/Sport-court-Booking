import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCourts from '../components/home/FeaturedCourts';
import WhyChooseUs from '../components/home/WhyChooseUs';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedCourts />
      <WhyChooseUs />
    </main>
  );
};

export default HomePage;

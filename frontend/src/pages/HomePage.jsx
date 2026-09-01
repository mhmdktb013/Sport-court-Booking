import React from 'react';
import Hero from '../components/home/Hero';
import SportCategories from '../components/home/SportCategories';
import FeaturedCourts from '../components/home/FeaturedCourts';
import WhyChooseUs from '../components/home/WhyChooseUs';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <SportCategories />
      <FeaturedCourts />
      <WhyChooseUs />
    </main>
  );
};

export default HomePage;

import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import CollectionBanner from '@/components/CollectionBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <CollectionBanner />
      <FeaturedProducts />
      <About />
    </>
  );
}

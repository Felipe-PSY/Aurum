import { HeroSection } from '../components/HeroSection';
import { CollectionSection } from '../components/CollectionSection';
import { BrandStorySection } from '../components/BrandStorySection';
import { ProductSection } from '../components/ProductSection';
import { LuxuryExperienceSection } from '../components/LuxuryExperienceSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { GallerySection } from '../components/GallerySection';
import { useDb } from '../context/DbContext';

const sectionComponents: Record<string, React.FC> = {
  CollectionSection,
  BrandStorySection,
  ProductSection,
  LuxuryExperienceSection,
  TestimonialSection,
  GallerySection,
};

export function HomePage() {
  const { siteConfig } = useDb();
  const sortedSections = [...siteConfig.homeSections]
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <HeroSection />
      {sortedSections.map((section) => {
        const Component = sectionComponents[section.component];
        return Component ? <Component key={section.id} /> : null;
      })}
    </>
  );
}

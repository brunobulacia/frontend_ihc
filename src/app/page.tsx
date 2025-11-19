import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}

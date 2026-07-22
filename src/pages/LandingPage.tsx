import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturedJobs from '@/components/FeaturedJobs';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-emerald-950 font-sans">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
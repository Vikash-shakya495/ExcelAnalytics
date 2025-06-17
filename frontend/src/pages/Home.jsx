import HeroSection from "../components/home/HeroSection";
// import FeaturesSection from "../components/home/FeaturesSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CallToActionSection from "../components/home/CallToActionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HeroSection />
      {/* <FeaturesSection /> */}
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
}

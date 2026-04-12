import Navbar from "@/components/Landing/Navbar";
import HeroSection from "@/components/Landing/HeroSection";
import CoreValues from "@/components/Landing/CoreValues";
import SuccessStory from "@/components/Landing/SuccessStory";
import ProductsSection from "@/components/Landing/ProductsSection";
import QualityStandards from "@/components/Landing/QualityStandards";
import ArticlesSection from "@/components/Landing/ArticlesSection";
import FAQSection from "@/components/Landing/FAQSection";
import ContactSection from "@/components/Landing/ContactSection";
import Footer from "@/components/Landing/Footer";
import WhatsAppButton from "@/components/Landing/WhatsAppButton";
import AnimatedSection from "@/components/Landing/AnimatedSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero: instant — no scroll animation, it's the first thing seen */}
        <HeroSection />

        {/* Chapter 1: Our Values — cards cascade up like a rising curtain */}
        <AnimatedSection delay={0} animation="fade-up">
          <CoreValues />
        </AnimatedSection>

        {/* Chapter 2: Our Story — slides in from the right, like opening a book */}
        <AnimatedSection delay={0.05} animation="fade-left">
          <SuccessStory />
        </AnimatedSection>

        {/* Chapter 3: Products — dramatic scale-reveal, spotlight moment */}
        <AnimatedSection delay={0} animation="scale-reveal">
          <ProductsSection />
        </AnimatedSection>

        {/* Chapter 4: Quality — slides in from the left, mirrored to story */}
        <AnimatedSection delay={0.05} animation="fade-right">
          <QualityStandards />
        </AnimatedSection>

        {/* Chapter 5: Articles — stagger children, each card tells its own story */}
        <AnimatedSection delay={0} animation="stagger">
          <ArticlesSection />
        </AnimatedSection>

        {/* Chapter 6: FAQ — curtain reveal, like lifting a veil on answers */}
        <AnimatedSection delay={0} animation="curtain">
          <FAQSection />
        </AnimatedSection>

        {/* Chapter 7: Contact — slides in from left, an invitation to connect */}
        <AnimatedSection delay={0} animation="fade-right">
          <ContactSection />
        </AnimatedSection>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;
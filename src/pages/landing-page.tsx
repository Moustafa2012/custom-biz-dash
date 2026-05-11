import { Navigation } from "@/components/navigation"
import HeroSection from "@/components/sections/home"
import { AboutUs } from "@/components/sections/about-us"
import Products from "@/components/sections/products"
import CoreValues from "@/components/sections/core-values"
import Quality from "@/components/sections/quality"
import SuccessStory from "@/components/sections/Success"
import ArticlesSection from "@/components/sections/articles"
import FAQ from "@/components/sections/faq"
import ContactUs from "@/components/sections/contact-us"
import Footer from "@/components/sections/footer"
import WhatsAppButton from "@/components/sections/WhatsAppButton"

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main>
        <section id="home">
          <HeroSection />
        </section>

        <section id="about">
          <AboutUs />
          <SuccessStory />
        </section>

        <section id="products">
          <Products />
        </section>

        <CoreValues />

        <section id="quality">
          <Quality />
        </section>

        <section id="articles">
          <ArticlesSection />
        </section>

        <section id="faq">
          <FAQ />
        </section>

        <section id="contact">
          <ContactUs />
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp button */}
      <WhatsAppButton />
    </div>
  )
}
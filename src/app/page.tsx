import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import HeroSection from "@/src/components/HeroSection";

export default function HomePage() {
  return (
    <section className="relative">
      <Header />
      <HeroSection />
      <Footer />
    </section>
  );
}

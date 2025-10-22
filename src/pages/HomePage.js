import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturedLawyers from "../components/FeaturedLawyers";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import LawLibrary from "../components/LawLibrary";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import LegalEaseSection from "../components/LegalEaseSection";
import FindLawyerSection from "../components/FindLawyerSection";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedLawyers />
      <LegalEaseSection/>
      <HowItWorks />
      <Testimonials />
      <LawLibrary />
      <FindLawyerSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HomePage;

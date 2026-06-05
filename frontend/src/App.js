import { Toaster } from "sonner";
import { useAssessmentModal } from "@/hooks";
import { AssessmentModal } from "@/components/AssessmentModal";
import { PromoBanner } from "@/components/PromoBanner";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Features } from "@/components/Features";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { ProductGallery } from "@/components/ProductGallery";
import { StorySection } from "@/components/StorySection";
import { Benefits } from "@/components/Benefits";
import { HowToApply } from "@/components/HowToApply";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FAQ } from "@/components/FAQ";
import { Reviews } from "@/components/Reviews";
import { EmailSignup } from "@/components/EmailSignup";
import { Footer } from "@/components/Footer";
import "@/App.css";

function App() {
  const { isOpen, openModal, closeModal } = useAssessmentModal();
  
  return (
    <div className="min-h-screen bg-[#050505]">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <AssessmentModal isOpen={isOpen} onClose={closeModal} />
      <PromoBanner />
      <Navigation />
      <Hero onTakeQuiz={openModal} />
      <Marquee />
      <Features />
      <DeliveryBanner />
      <ProductGallery />
      <StorySection />
      <Benefits />
      <HowToApply />
      <ProductShowcase />
      <Reviews />
      <FAQ />
      <EmailSignup />
      <Footer />
    </div>
  );
}

export default App;

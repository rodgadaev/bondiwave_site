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
import { DeferMount } from "@/components/DeferMount";
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
      <DeferMount minHeight={700}><ProductGallery /></DeferMount>
      <DeferMount minHeight={700}><StorySection /></DeferMount>
      <DeferMount minHeight={500}><Benefits /></DeferMount>
      <DeferMount minHeight={600}><HowToApply /></DeferMount>
      <div className="bg-[#050505]" data-testid="how-product-divider">
        <div className="h-0.5 bg-[#00B4D8]" />
      </div>
      <DeferMount minHeight={700}><ProductShowcase /></DeferMount>
      <DeferMount minHeight={500}><Reviews /></DeferMount>
      <DeferMount minHeight={400}><FAQ /></DeferMount>
      <DeferMount minHeight={300}><EmailSignup /></DeferMount>
      <DeferMount minHeight={200}><Footer /></DeferMount>
    </div>
  );
}

export default App;

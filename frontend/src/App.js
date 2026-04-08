import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, Moon, Zap, Heart, Shield, Droplets, 
  Instagram, ShoppingBag, ArrowRight,
  Check, ChevronDown, X, Loader2
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Brand Assets
const ASSETS = {
  logo: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/9rfimotz_Bondi%20Wave%20Logo.svg",
  heroProduct: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/4ffyuxz2_5.svg",
  display1: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/qdbr08jk_BREETHE%20FREELY%20-%20Display%20Cases.svg",
};

// Social Links
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/thebondiwave/",
  tiktok: "https://tiktok.com/@thebondiwave",
  amazon: "https://www.amazon.com.au/dp/B0GR5HX9PJ",
};

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

// Assessment Modal Component
const AssessmentModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-5=questions, 6=email, 7=analyzing, 8=results
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);

  const questions = [
    {
      id: 1,
      question: "What brings you here today?",
      options: [
        { text: "I snore (or my partner says I do)", profile: "A" },
        { text: "I run out of breath quickly during cardio", profile: "B" },
        { text: "I wake up with a dry mouth / I'm a mouth breather", profile: "A" },
        { text: "I always feel \"stuffy\" or congested", profile: "C" },
        { text: "I wake up tired and unrefreshed", profile: "A" },
      ]
    },
    {
      id: 2,
      question: "How often does this issue affect you?",
      options: [
        { text: "Every single night/day", profile: null },
        { text: "Only during exercise or high exertion", profile: "B" },
        { text: "Mostly during allergy season or when sick", profile: "C" },
        { text: "It comes and goes", profile: null },
      ]
    },
    {
      id: 3,
      question: "Do you have any known nasal structure issues?",
      options: [
        { text: "Yes, a Deviated Septum (crooked nose)", profile: "C" },
        { text: "Yes, a Collapsed Nasal Valve (nostrils pinch shut when breathing in)", profile: "B" },
        { text: "I suspect I do, but haven't checked", profile: null },
        { text: "No, my nose structure is fine", profile: null },
      ]
    },
    {
      id: 4,
      question: "How does your breathing feel when you lie down to sleep?",
      options: [
        { text: "One side usually blocks up (The \"Cycle\")", profile: "C" },
        { text: "I feel like I'm suffocating unless I open my mouth", profile: "A" },
        { text: "It feels fine, but I still snore", profile: "A" },
        { text: "I don't notice, I fall asleep instantly", profile: null },
      ]
    },
    {
      id: 5,
      question: "What have you tried so far to fix this?",
      options: [
        { text: "Decongestant Sprays", profile: null },
        { text: "Mouth Tape", profile: "A" },
        { text: "Mouthguards / Mandibular Devices", profile: "A" },
        { text: "Nothing yet", profile: null },
      ]
    },
  ];

  const profiles = {
    A: {
      name: "The Restricted Sleeper",
      diagnosis: "Your assessment indicates Nocturnal Nasal Obstruction. When you lie down, gravity and tissue relaxation cause your nasal passages to narrow. To compensate, your body forces your mouth open, leading to snoring and dry mouth.",
      solution: "Bondi Wave strips mechanically pull the nasal valves open, counteracting gravity. This keeps your airway expanded all night, promoting silent, restorative nasal breathing without the need for mouth tape."
    },
    B: {
      name: "The Oxygen-Starved Athlete",
      diagnosis: "You likely suffer from Dynamic Nasal Valve Collapse. During intense cardio, the negative pressure of inhaling hard actually sucks your nostrils shut, capping your VO2 max and forcing you to switch to inefficient mouth breathing.",
      solution: "Think of Bondi Wave as an external stent for your nose. It reinforces the nasal wall, preventing collapse during heavy inhalation. This allows you to maintain nasal breathing at higher heart rates, improving oxygen efficiency."
    },
    C: {
      name: "The Structural Blockage",
      diagnosis: "You have Structural Airway Resistance. Because of a deviation or chronic inflammation, your airflow is physically bottlenecked. Sprays only shrink the tissue temporarily, but they don't widen the actual passage.",
      solution: "While surgery is the only permanent fix for a septum, Bondi Wave is the immediate non-surgical relief. By physically lifting the outer nasal wall, it creates extra clearance around the deviation, instantly doubling airflow volume."
    }
  };

  const calculateProfile = () => {
    const counts = { A: 0, B: 0, C: 0 };
    Object.values(answers).forEach(answer => {
      if (answer && counts[answer] !== undefined) {
        counts[answer]++;
      }
    });
    
    // Find the profile with the most matches
    let maxProfile = "A";
    let maxCount = counts.A;
    
    if (counts.B > maxCount) {
      maxProfile = "B";
      maxCount = counts.B;
    }
    if (counts.C > maxCount) {
      maxProfile = "C";
    }
    
    return maxProfile;
  };

  const handleAnswer = (questionId, profileType) => {
    setAnswers(prev => ({ ...prev, [questionId]: profileType }));
    
    if (currentStep < 5) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setCurrentStep(6); // Go to email gate
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setCurrentStep(7); // Show analyzing
    
    try {
      // Submit to Netlify Forms (which triggers Resend)
      const formData = new FormData();
      formData.append('form-name', 'assessment');
      formData.append('email', email);
      formData.append('profile', calculateProfile());
      
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      
      // Calculate and show results after fake analysis
      setTimeout(() => {
        setProfile(calculateProfile());
        setCurrentStep(8);
        localStorage.setItem('hasTakenAssessment', 'true');
      }, 1500);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setCurrentStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = currentStep === 0 ? 0 : currentStep <= 5 ? (currentStep / 6) * 100 : currentStep === 6 ? 85 : 100;

  const handleClose = () => {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setEmail("");
      setProfile(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        data-testid="assessment-modal"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#111111] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#111111] border-b border-white/10 p-4 z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                Airflow Assessment
              </span>
              <button
                onClick={handleClose}
                className="text-neutral-400 hover:text-white transition-colors"
                data-testid="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00BFFF]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 0: Intro */}
              {currentStep === 0 && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                    Difficulty <span className="text-[#00BFFF]">breathing?</span>
                  </h2>
                  <p className="text-neutral-400 mb-8">
                    Take the 60-second Airflow Assessment to discover your specific breathing bottleneck.
                  </p>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full bg-[#00BFFF] text-black font-bold uppercase tracking-wider py-4 px-8 hover:bg-white transition-colors"
                    data-testid="start-assessment"
                  >
                    Start Assessment
                  </button>
                  <p className="text-neutral-600 text-xs mt-4">
                    Free analysis. No credit card required.
                  </p>
                </motion.div>
              )}
              
              {/* Steps 1-5: Questions */}
              {currentStep >= 1 && currentStep <= 5 && (
                <motion.div
                  key={`question-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <p className="font-mono text-xs text-[#00BFFF] uppercase tracking-wider mb-2">
                    Question {currentStep} of 5
                  </p>
                  <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-tight mb-6">
                    {questions[currentStep - 1].question}
                  </h3>
                  <div className="space-y-3">
                    {questions[currentStep - 1].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(currentStep, option.profile)}
                        className="w-full text-left bg-[#1a1a1a] border border-white/10 p-4 hover:border-[#00BFFF] hover:bg-[#00BFFF]/10 transition-all group"
                        data-testid={`option-${idx}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs font-mono group-hover:border-[#00BFFF] group-hover:text-[#00BFFF]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-neutral-300 group-hover:text-white">
                            {option.text}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step 6: Email Gate */}
              {currentStep === 6 && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#00BFFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#00BFFF]" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">
                    Your Breathing Profile is <span className="text-[#00BFFF]">Ready.</span>
                  </h2>
                  <p className="text-neutral-400 mb-8">
                    Enter your email to unlock your personalized sleep & airflow report + receive an exclusive <span className="text-[#00BFFF] font-bold">discount code</span>.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white placeholder:text-neutral-600 focus:border-[#00BFFF] focus:outline-none py-4 px-4 font-mono"
                      data-testid="assessment-email-input"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#00BFFF] text-black font-bold uppercase tracking-wider py-4 px-8 hover:bg-white transition-colors disabled:opacity-50"
                      data-testid="reveal-results"
                    >
                      Reveal My Results
                    </button>
                  </form>
                </motion.div>
              )}
              
              {/* Step 7: Analyzing */}
              {currentStep === 7 && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Loader2 className="w-12 h-12 text-[#00BFFF] animate-spin mx-auto mb-6" />
                  <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">
                    Analyzing Your Responses...
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    Building your personalized breathing profile
                  </p>
                </motion.div>
              )}
              
              {/* Step 8: Results */}
              {currentStep === 8 && profile && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Result Banner */}
                  <div className="bg-[#00BFFF]/10 border border-[#00BFFF]/30 p-4 mb-6 text-center">
                    <p className="font-mono text-xs text-[#00BFFF] uppercase tracking-wider mb-1">
                      Your Result
                    </p>
                    <h2 className="font-heading text-2xl font-bold uppercase text-white">
                      {profiles[profile].name}
                    </h2>
                  </div>
                  
                  {/* Diagnosis */}
                  <div className="mb-6">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#00BFFF] mb-2">
                      Diagnosis
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {profiles[profile].diagnosis}
                    </p>
                  </div>
                  
                  {/* Solution */}
                  <div className="mb-8">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#00BFFF] mb-2">
                      The Solution
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {profiles[profile].solution}
                    </p>
                  </div>
                  
                  {/* Offer */}
                  <div className="bg-[#1a1a1a] border border-white/10 p-6 text-center">
                    <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">
                      Welcome to the Inner Circle.
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6">
                      Check your inbox for your full report and exclusive discount code.
                    </p>
                    <a
                      href={SOCIAL_LINKS.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#00BFFF] text-black font-bold uppercase tracking-wider py-4 px-8 hover:bg-white transition-colors"
                      data-testid="shop-bondi-wave"
                    >
                      <ShoppingBag size={18} />
                      Shop Now
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Assessment Modal Trigger Hook
const useAssessmentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if user has already seen/closed the assessment
    if (localStorage.getItem('hasTakenAssessment')) return;
    
    // Auto-trigger after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('hasTakenAssessment', 'true');
  };
  
  return { isOpen, setIsOpen, closeModal };
};

// TikTok Icon Component
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

// Marquee Component
const Marquee = () => {
  const items = ["LATEX FREE", "HYPO ALLERGENIC", "MEDICAL GRADE", "SWEAT PROOF", "12HR USE", "INSTANT RESULTS"];
  
  return (
    <div className="border-y border-white/10 py-4 overflow-hidden bg-[#0A0A0A]">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-white/60 mx-8">
            {item} <span className="text-[#00B4D8]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-[#050505]'}`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <a href="/" data-testid="logo-link">
          <img src={ASSETS.logo} alt="Bondi Wave" className="h-12 md:h-16 lg:h-20" />
        </a>
        
        <div className="flex items-center gap-4 md:gap-6">
          <a 
            href={SOCIAL_LINKS.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#00B4D8] transition-colors"
            data-testid="nav-instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href={SOCIAL_LINKS.amazon} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#00B4D8] text-black font-bold text-sm uppercase tracking-wider px-5 py-2 hover:bg-white transition-colors"
            data-testid="nav-amazon"
          >
            <ShoppingBag size={16} />
            Shop
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="min-h-[80vh] relative overflow-hidden flex items-center" data-testid="hero-section">
      {/* Background Glow */}
      <div className="absolute inset-0 hero-glow" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div {...fadeUp} className="space-y-8">
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4"
            >
              Now Available
            </motion.p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9]">
              <span className="tracking-[0.02em]">Breathe</span><br/>
              <span className="text-[#00B4D8] tracking-[0.02em]">Better.</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-md leading-relaxed">
            Premium nasal strips engineered for peak performance. Whether you're chasing records or chasing sleep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group"
              data-testid="hero-cta"
            >
              <ShoppingBag size={18} />
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#benefits"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 hover:border-[#00B4D8] hover:text-[#00B4D8] transition-all duration-300"
              data-testid="hero-learn-more"
            >
              Learn More
              <ChevronDown size={18} />
            </a>
          </div>
        </motion.div>
        
        {/* Right Content - Static Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[100px] rounded-full" />
            <img 
              src={ASSETS.heroProduct} 
              alt="Bondi Wave Nose Strips" 
              className="relative z-10 w-full max-w-lg lg:max-w-xl drop-shadow-2xl"
              data-testid="hero-product-image"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    { icon: Shield, title: "Medical Grade", desc: "Hospital-quality adhesive that's gentle on skin" },
    { icon: Droplets, title: "Sweat Proof", desc: "Stays put during intense workouts and humid nights" },
    { icon: Heart, title: "Hypo Allergenic", desc: "Safe for sensitive skin, latex-free formula" },
    { icon: Zap, title: "Instant Results", desc: "Feel the difference with your first breath" },
  ];
  
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              className="bg-[#050505] border border-white/5 p-8 hover:border-[#00B4D8]/50 transition-colors duration-500 group"
              data-testid={`feature-card-${i}`}
            >
              <feature.icon className="w-10 h-10 text-[#00B4D8] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-bold uppercase tracking-wide mb-3">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Product Gallery Section (Amazon-style)
const ProductGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const galleryImages = [
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/gxfhc3hc_MAIN%20IMAGE%20%289%29.png",
      alt: "Bondi Wave Nose Strips - Product Box & Strips"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/35il9p3e_MAIN%20IMAGE%20%2811%29.png",
      alt: "Bondi Wave Nose Strips - Sweat Proof on Water"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/mx0gspt5_MAIN%20IMAGE%20%2812%29.png",
      alt: "Bondi Wave Nose Strips - Product Detail"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/9o82bugn_6.png",
      alt: "Bondi Wave Nose Strips - Lifestyle"
    },
  ];

  const bulletPoints = [
    { label: "Maximize Oxygen Intake", text: "Instantly opens nasal passages by up to 35% for improved breathing during high-intensity training, running, or cycling" },
    { label: "Recover Better, Sleep Quieter", text: "Reduces snoring and improves sleep quality by facilitating deep nasal breathing, helping you wake up refreshed" },
    { label: "Active-Hold Adhesive", text: "Engineered with extra-strength, sweat-resistant adhesive that stays secure through intense gym sessions and humid nights" },
    { label: "Sleek Matte Black Design", text: "Premium matte black strips designed for athletes who care about performance and aesthetics" },
    { label: "Hypoallergenic & Latex-Free", text: "Gentle on the skin but tough on the hold, suitable for all-night wear without irritation" },
    { label: "30 Pack Value", text: "Includes 30 premium nasal strips providing a full month supply for consistent performance enhancement" },
  ];

  // Auto-cycle images
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, galleryImages.length]);

  return (
    <section className="py-8 md:py-10 bg-[#050505]" data-testid="product-gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Up Close</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            The Details
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <motion.div {...fadeUp} className="flex gap-3 md:gap-4 self-start">
            {/* Thumbnail Column */}
            <div className="flex flex-col gap-2 w-16 md:w-20 flex-shrink-0">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => { setActiveIndex(i); setIsHovering(true); }}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 border-2 overflow-hidden transition-all duration-300 bg-[#0A0A0A] ${
                    activeIndex === i
                      ? 'border-[#00B4D8] shadow-[0_0_12px_rgba(0,180,216,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  data-testid={`gallery-thumb-${i}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              className="flex-1 relative bg-[#0A0A0A] border border-white/10 overflow-hidden aspect-square"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-testid="gallery-main-image"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={galleryImages[activeIndex].src}
                  alt={galleryImages[activeIndex].alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1">
                <span className="font-mono text-xs text-[#00B4D8]">{activeIndex + 1}</span>
                <span className="font-mono text-xs text-neutral-500"> / {galleryImages.length}</span>
              </div>

              {/* Progress dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      activeIndex === i ? 'w-6 bg-[#00B4D8]' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div {...fadeUp} className="space-y-6">
            <div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
                Premium Nasal Strips
              </h3>
              <p className="text-neutral-400 text-sm">
                Extra Strength Airflow for Sport, Performance & Deep Recovery Sleep
              </p>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-heading text-3xl font-bold text-[#00B4D8]">$29.95</span>
                <span className="text-sm text-neutral-500">AUD</span>
                <span className="text-neutral-600 mx-1">|</span>
                <span className="text-sm text-neutral-400">30 Pack Matte Black</span>
              </div>
            </div>

            {/* Bullet Points - Styled as expandable feature list */}
            <div className="space-y-0 border border-white/5 divide-y divide-white/5">
              {bulletPoints.map((point, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 hover:bg-[#0A0A0A] transition-colors"
                  data-testid={`gallery-bullet-${i}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center mt-0.5">
                    <span className="font-mono text-xs text-[#00B4D8] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold uppercase tracking-wide text-white group-hover:text-[#00B4D8] transition-colors">
                      {point.label}
                    </p>
                    <p className="text-neutral-500 text-xs leading-relaxed mt-1">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group w-full justify-center"
              data-testid="gallery-shop-btn"
            >
              <ShoppingBag size={18} />
              Shop on Amazon
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Story Section with Interactive Map
const StorySection = () => {
  const [activeStop, setActiveStop] = useState(null);
  
  const stops = [
    {
      id: 1,
      name: "Bondi Beach",
      x: 15,
      y: 25,
      image: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/lpl15a9p_IMG_5015%202.jpg"
    },
    {
      id: 2,
      name: "Bondi Icebergs",
      x: 28,
      y: 42,
      image: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/95k5d59b_IMG_5014.jpg"
    },
    {
      id: 3,
      name: "Tamarama Beach",
      x: 48,
      y: 55,
      image: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/3pzssuza_IMG_5013%202.jpg"
    },
    {
      id: 4,
      name: "Mackenzies Point",
      x: 68,
      y: 48,
      image: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/mkqh7v3w_IMG_5012.jpg"
    },
    {
      id: 5,
      name: "Bronte Beach",
      x: 88,
      y: 65,
      image: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/jw9l8zyj_IMG_5011.PNG"
    }
  ];
  
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Our Origin</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            The Bondi Wave<br/>Story
          </h2>
          <p className="text-neutral-400 text-lg max-w-3xl mx-auto leading-relaxed">
            The Bondi to Bronte coastal walk is one of Australia's most iconic routes — 
            a world-renowned path beloved by runners, walkers, tourists and locals alike. 
            Celebrated for its breathtaking ocean vistas, vibrant athletic culture, and the 
            invigorating embrace of fresh sea-salt air.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Map */}
          <motion.div {...fadeUp} className="relative">
            <div className="relative bg-[#050505] border border-white/10 p-4 md:p-6 overflow-hidden" data-testid="interactive-map" style={{ minHeight: '320px' }}>
              {/* Map SVG */}
              <svg viewBox="0 0 100 70" className="w-full" style={{ height: '280px' }}>
                {/* Definitions */}
                <defs>
                  <linearGradient id="oceanGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#007790" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#050505" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0d0d0d" stopOpacity="1" />
                  </linearGradient>
                  <pattern id="wavePattern" x="0" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
                    <path d="M 0 2 Q 2 0, 4 2 Q 6 4, 8 2" fill="none" stroke="#00B4D8" strokeWidth="0.3" strokeOpacity="0.3" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Ocean Area (bottom half) */}
                <path d="M 0 35 Q 25 40, 50 38 Q 75 36, 100 42 L 100 70 L 0 70 Z" fill="url(#oceanGradient)" />
                <path d="M 0 35 Q 25 40, 50 38 Q 75 36, 100 42 L 100 70 L 0 70 Z" fill="url(#wavePattern)" />
                
                {/* Wave lines */}
                <path d="M 0 48 Q 20 52, 40 48 Q 60 44, 80 50 Q 90 52, 100 48" fill="none" stroke="#00B4D8" strokeWidth="0.4" strokeOpacity="0.2" />
                <path d="M 0 55 Q 25 58, 50 54 Q 75 50, 100 56" fill="none" stroke="#00B4D8" strokeWidth="0.3" strokeOpacity="0.15" />
                <path d="M 0 62 Q 30 65, 60 61 Q 85 58, 100 63" fill="none" stroke="#00B4D8" strokeWidth="0.2" strokeOpacity="0.1" />
                
                {/* Land Area (top half) */}
                <path d="M 0 0 L 100 0 L 100 38 Q 75 32, 50 34 Q 25 36, 0 30 Z" fill="url(#landGradient)" />
                
                {/* Buildings/Houses silhouette on land */}
                <g fill="#1f1f1f" opacity="0.8">
                  {/* Building cluster 1 */}
                  <rect x="5" y="8" width="4" height="12" />
                  <rect x="10" y="12" width="3" height="8" />
                  <rect x="14" y="10" width="5" height="10" />
                  
                  {/* Building cluster 2 */}
                  <rect x="30" y="14" width="4" height="10" />
                  <rect x="35" y="16" width="3" height="8" />
                  <rect x="39" y="12" width="5" height="12" />
                  
                  {/* Building cluster 3 */}
                  <rect x="55" y="10" width="3" height="14" />
                  <rect x="59" y="14" width="4" height="10" />
                  <rect x="64" y="12" width="3" height="12" />
                  
                  {/* Building cluster 4 */}
                  <rect x="78" y="8" width="5" height="16" />
                  <rect x="84" y="12" width="4" height="12" />
                  <rect x="89" y="10" width="6" height="14" />
                </g>
                
                {/* Trees/vegetation dots */}
                <g fill="#00B4D8" opacity="0.15">
                  <circle cx="22" cy="18" r="2" />
                  <circle cx="26" cy="20" r="1.5" />
                  <circle cx="48" cy="16" r="2" />
                  <circle cx="52" cy="19" r="1.5" />
                  <circle cx="72" cy="14" r="2" />
                  <circle cx="76" cy="17" r="1.5" />
                </g>
                
                {/* Promenade/path line along coast */}
                <path
                  d="M 5 28 Q 15 32, 28 34 Q 40 36, 50 35 Q 60 34, 70 32 Q 82 30, 95 34"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Walking Path (coastal trail) */}
                <path
                  d="M 12 30 Q 20 34, 28 35 Q 40 37, 50 36 Q 60 35, 70 33 Q 82 32, 90 35"
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="3,1.5"
                  filter="url(#glow)"
                />
                
                {/* Beach areas (sandy patches) */}
                <ellipse cx="15" cy="38" rx="8" ry="3" fill="#1a1a1a" opacity="0.5" />
                <ellipse cx="50" cy="40" rx="6" ry="2.5" fill="#1a1a1a" opacity="0.5" />
                <ellipse cx="88" cy="42" rx="7" ry="3" fill="#1a1a1a" opacity="0.5" />
                
                {/* Stop Points - Smaller */}
                {stops.map((stop, index) => {
                  const adjustedY = [30, 34, 36, 33, 35][index];
                  const adjustedX = [12, 28, 50, 70, 90][index];
                  return (
                    <g key={stop.id}>
                      {activeStop === stop.id && (
                        <circle
                          cx={adjustedX}
                          cy={adjustedY}
                          r="4"
                          fill="none"
                          stroke="#00B4D8"
                          strokeWidth="0.5"
                          opacity="0.5"
                        >
                          <animate attributeName="r" from="2.5" to="6" dur="1s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle
                        cx={adjustedX}
                        cy={adjustedY}
                        r="2.5"
                        fill={activeStop === stop.id ? "#00B4D8" : "#050505"}
                        stroke="#00B4D8"
                        strokeWidth="1"
                        style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
                        onMouseEnter={() => setActiveStop(stop.id)}
                        onMouseLeave={() => setActiveStop(null)}
                        data-testid={`map-stop-${stop.id}`}
                      />
                      <text
                        x={adjustedX}
                        y={adjustedY - 5}
                        textAnchor="middle"
                        fill={activeStop === stop.id ? "#00B4D8" : "#666"}
                        fontSize="2.2"
                        fontFamily="Oswald, sans-serif"
                        style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}
                      >
                        {stop.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Location Labels */}
                <text x="5" y="6" fill="#00B4D8" fontSize="3.5" fontFamily="Oswald, sans-serif" fontWeight="bold" letterSpacing="0.1em">
                  BONDI
                </text>
                <text x="85" y="6" fill="#00B4D8" fontSize="3.5" fontFamily="Oswald, sans-serif" fontWeight="bold" letterSpacing="0.1em">
                  BRONTE
                </text>
                
                {/* Ocean label */}
                <text x="50" y="60" textAnchor="middle" fill="#00B4D8" fontSize="2.5" fontFamily="Oswald, sans-serif" opacity="0.4" letterSpacing="0.3em">
                  PACIFIC OCEAN
                </text>
                
                {/* Compass */}
                <g transform="translate(94, 58)">
                  <circle cx="0" cy="0" r="3" fill="#0a0a0a" stroke="#262626" strokeWidth="0.3" />
                  <text x="0" y="0.5" textAnchor="middle" fill="#00B4D8" fontSize="2" fontFamily="Oswald" fontWeight="bold">N</text>
                </g>
              </svg>
              
              {/* Hover Image Display - Smaller */}
              {stops.map((stop) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ 
                    opacity: activeStop === stop.id ? 1 : 0,
                    scale: activeStop === stop.id ? 1 : 0.9,
                    y: activeStop === stop.id ? 0 : 10
                  }}
                  transition={{ duration: 0.25 }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${activeStop === stop.id ? 'z-20' : 'z-0'}`}
                  style={{ width: '200px', height: '150px' }}
                >
                  <div className="relative w-full h-full bg-[#050505] border border-[#00B4D8] overflow-hidden shadow-2xl">
                    <img 
                      src={stop.image} 
                      alt={`Run club at ${stop.name}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="font-heading text-sm uppercase text-white">{stop.name}</p>
                      <p className="font-mono text-[10px] text-[#00B4D8] uppercase tracking-wider">Run Club</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Map Legend */}
              <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#00B4D8] opacity-60"></span>
                  Coastal Walk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full border border-[#00B4D8]"></span>
                  Hover to explore
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Story Text */}
          <motion.div {...fadeUp} className="space-y-6">
            <div className="bg-[#050505] border border-white/5 p-8">
              <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
                Born From The<br/><span className="text-[#00B4D8]">Bondi Spirit</span>
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Bondi Wave was founded by a community of dedicated run club enthusiasts who 
                discovered something transformative along these coastal cliffs — the power of 
                proper breathing combined with the pure, salt-kissed air of Sydney's eastern beaches.
              </p>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Every morning, as the sun rises over the Pacific, hundreds of runners and walkers 
                trace this legendary 2.5km path. They come for the challenge, stay for the community, 
                and leave with lungs full of the freshest air on earth.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Our mission is simple: to help people everywhere breathe like they're running 
                the Bondi to Bronte — freely, deeply, and with purpose.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#050505] border border-white/5 p-4 text-center">
                <div className="font-heading text-2xl md:text-3xl font-bold text-[#00B4D8]">2.5</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Kilometres</div>
              </div>
              <div className="bg-[#050505] border border-white/5 p-4 text-center">
                <div className="font-heading text-2xl md:text-3xl font-bold text-[#00B4D8]">1M+</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Yearly Visitors</div>
              </div>
              <div className="bg-[#050505] border border-white/5 p-4 text-center">
                <div className="font-heading text-2xl md:text-3xl font-bold text-[#00B4D8]">∞</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Ocean Views</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Benefits Section
const Benefits = () => {
  const sportBenefits = [
    "Increases airflow by up to 35%",
    "Reduces breathing effort during cardio",
    "Helps maintain nasal breathing under stress",
    "Improves oxygen delivery to muscles",
    "Reduces mouth breathing and dry throat"
  ];
  
  const sleepBenefits = [
    "Reduces snoring intensity",
    "Promotes nasal breathing for deeper sleep",
    "May help with mild sleep apnea symptoms",
    "Reduces morning dry mouth",
    "Helps maintain optimal sleep position"
  ];
  
  return (
    <section id="benefits" className="py-8 md:py-10" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Science</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Why Nose<br/>Strips Work
          </h2>
        </motion.div>
        
        {/* Benefits Image */}
        <motion.div {...fadeUp} className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[100px] rounded-full" />
            <img 
              src="https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/gkt75uwm_BREETHE%20FREELY%20-%20Display%20Cases%20%282%29.svg"
              alt="Bondi Wave Nose Strips - How They Work"
              className="relative z-10 w-full max-w-3xl"
              data-testid="benefits-image"
            />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sport Benefits */}
          <motion.div 
            {...fadeUp}
            className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12"
            data-testid="sport-benefits"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#00B4D8]/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#00B4D8]" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#00B4D8]">Performance</p>
                <h3 className="font-heading text-2xl font-bold uppercase">For Sport</h3>
              </div>
            </div>
            
            <ul className="space-y-4">
              {sportBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-neutral-500 italic">
                "Nasal breathing during exercise can improve nitric oxide production by up to 15%, 
                enhancing oxygen uptake and athletic performance."
              </p>
            </div>
          </motion.div>
          
          {/* Sleep Benefits */}
          <motion.div 
            {...fadeUp}
            className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12"
            data-testid="sleep-benefits"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#00B4D8]/10 flex items-center justify-center">
                <Moon className="w-7 h-7 text-[#00B4D8]" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#00B4D8]">Recovery</p>
                <h3 className="font-heading text-2xl font-bold uppercase">For Sleep</h3>
              </div>
            </div>
            
            <ul className="space-y-4">
              {sleepBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-neutral-500 italic">
                "Studies show that nasal breathing during sleep increases parasympathetic activity, 
                promoting deeper and more restorative sleep cycles."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Product Showcase
const ProductShowcase = () => {
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="product-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Product</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
              30 Strips.<br/>1 Month Supply.
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Each box contains 30 premium nasal strips — one for every day of the month. 
              Designed for both sleep and sport, so you're covered 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="bg-[#050505] border border-white/10 px-6 py-4">
                <div className="font-heading text-3xl font-bold text-[#00B4D8]">$29.95</div>
                <div className="text-sm text-neutral-500">AUD / box</div>
              </div>
              <div className="bg-[#050505] border border-white/10 px-6 py-4">
                <div className="font-heading text-3xl font-bold">$1.00</div>
                <div className="text-sm text-neutral-500">per strip</div>
              </div>
            </div>
            
            <a 
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group"
              data-testid="shop-amazon-btn"
            >
              <ShoppingBag size={20} />
              Shop on Amazon
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          
          <motion.div 
            {...fadeUp}
            className="relative"
          >
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[100px] rounded-full" />
              <img 
                src={ASSETS.display1} 
                alt="Bondi Wave Display Case" 
                className="relative z-10 w-full max-w-xl mx-auto"
                data-testid="product-display"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Email Signup Section
const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('form-name', 'waitlist');
      formData.append('email', email);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      
      if (response.ok) {
        toast.success("Welcome to the wave! Check your inbox for an exclusive offer.");
        setSubscribed(true);
        setEmail("");
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="signup" className="py-16 md:py-20" data-testid="waitlist-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
        <motion.div {...fadeUp}>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Stay Connected</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            Get Exclusive<br/>Offers
          </h2>
          <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">
            Sign up for exclusive discounts, breathing tips, and be the first to know about new drops.
          </p>
          
          {subscribed ? (
            <div className="bg-[#0A0A0A] border border-[#00B4D8] p-8" data-testid="success-message">
              <Check className="w-12 h-12 text-[#00B4D8] mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold uppercase mb-2">You're In!</h3>
              <p className="text-neutral-400">Check your inbox for your welcome offer.</p>
            </div>
          ) : (
            <form 
              name="waitlist"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-b-2 border-white/20 text-white placeholder:text-neutral-600 focus:border-[#00B4D8] focus:outline-none py-4 px-0 font-mono text-center sm:text-left"
                data-testid="email-input"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="subscribe-btn"
              >
                {loading ? "..." : "Sign Up"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#050505]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={ASSETS.logo} alt="Bondi Wave" className="h-12 md:h-14 mb-4" />
            <p className="text-neutral-500 text-sm leading-relaxed">
              Premium nasal strips engineered for athletes and anyone who values quality sleep.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#benefits" className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#signup" className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm">
                  Get Offers
                </a>
              </li>
              <li>
                <a 
                  href={SOCIAL_LINKS.amazon} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm"
                >
                  Shop on Amazon
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                data-testid="footer-instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href={SOCIAL_LINKS.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                data-testid="footer-tiktok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2026 Bondi Wave. All rights reserved.
          </p>
          <p className="text-neutral-600 text-sm">
            Made with <Wind className="inline w-4 h-4 text-[#00B4D8]" /> in Australia
          </p>
        </div>
      </div>
    </footer>
  );
};

// Promo Banner Component
const PromoBanner = () => {
  const promoItems = [
    "NOW AVAILABLE — SHOP ON AMAZON",
    "FREE SHIPPING ON YOUR FIRST ORDER",
    "30 PREMIUM STRIPS — JUST $29.95 AUD",
  ];
  
  return (
    <a 
      href={SOCIAL_LINKS.amazon}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#00B4D8] py-2 overflow-hidden cursor-pointer hover:bg-[#00a0c0] transition-colors"
      data-testid="promo-banner"
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {[...promoItems, ...promoItems, ...promoItems, ...promoItems].map((item, i) => (
          <span key={i} className="font-heading text-xs md:text-sm uppercase tracking-[0.2em] text-black font-bold mx-8">
            {item} <span className="mx-4">★</span>
          </span>
        ))}
      </div>
    </a>
  );
};

// Main App
function App() {
  const { isOpen, closeModal } = useAssessmentModal();
  
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
      <Hero />
      <Marquee />
      <Features />
      <ProductGallery />
      <StorySection />
      <Benefits />
      <ProductShowcase />
      <EmailSignup />
      <Footer />
    </div>
  );
}

export default App;

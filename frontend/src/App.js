import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, Moon, Zap, Heart, Shield, Droplets, 
  Instagram, ShoppingBag, ArrowRight,
  Check, ChevronDown, X, Loader2, Lock, RotateCcw, Star
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Brand Assets
const ASSETS = {
  logo: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/9rfimotz_Bondi%20Wave%20Logo.svg",
  heroProduct: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/b62x8g1r_BREATHE%20BETTER.%20%281%29.png",
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-1 flex items-center justify-between">
        <a href="/" data-testid="logo-link">
          <img src={ASSETS.logo} alt="Bondi Wave" className="h-16 md:h-24 lg:h-28" />
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
    <section className="relative flex items-center" data-testid="hero-section">
      {/* Background Glow */}
      <div className="absolute inset-0 hero-glow" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-16 md:pt-8 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
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
              href="#product-gallery"
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
          className="relative flex justify-center lg:justify-end mb-[-80px] z-20"
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
  const thumbColumnRef = useRef(null);

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
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/fdkzlofh_1.png",
      alt: "Bondi Wave - Increase Airflow by 35%"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/kvr3eima_2.png",
      alt: "Bondi Wave vs Other Nose Strips"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/4vitb6g4_3.png",
      alt: "Bondi Wave - Advanced Layer Technology"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/h55duslj_5.png",
      alt: "Bondi Wave - From Bondi to Bronte to Deep Sleep"
    },
  ];

  const bulletPoints = [
    { label: "Maximize Oxygen Intake", text: "Instantly opens nasal passages by up to 35% for improved breathing during high-intensity training, running, or cycling" },
    { label: "Recover Better, Sleep Quieter", text: "Reduces snoring and improves sleep quality by facilitating deep nasal breathing, helping you wake up refreshed" },
    { label: "Active-Hold Adhesive", text: "Engineered with extra-strength, sweat-resistant adhesive that stays secure through intense gym sessions and humid nights" },
    { label: "Sleek Matte Black Design", text: "Premium matte black strips designed for athletes who care about performance and aesthetics" },
  ];

  // Auto-cycle images
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, galleryImages.length]);

  // Auto-scroll thumbnail column to keep active thumb visible
  useEffect(() => {
    const container = thumbColumnRef.current;
    if (!container) return;
    const thumb = container.children[activeIndex];
    if (thumb) {
      const thumbTop = thumb.offsetTop - container.offsetTop;
      container.scrollTo({ top: thumbTop - 8, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <section id="product-gallery" className="py-8 md:py-10 bg-[#050505]" data-testid="product-gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Up Close</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            The Details
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <motion.div {...fadeUp} className="self-start space-y-3">
            <div className="flex gap-3 md:gap-4">
            {/* Thumbnail Column */}
            <div ref={thumbColumnRef} className="flex flex-col gap-2 w-16 md:w-20 flex-shrink-0 max-h-[500px] overflow-y-auto gallery-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => { setActiveIndex(i); setIsHovering(true); }}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 overflow-hidden transition-all duration-300 bg-[#0A0A0A] aspect-square ${
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
            <div className="flex-1">
              <div
                className="relative bg-[#0A0A0A] border border-white/10 overflow-hidden w-full aspect-square"
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
                    className="absolute inset-0 w-full h-full object-cover"
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
            </div>
            </div>

            {/* Trust Icons - aligned with main image */}
            <div className="flex justify-evenly gap-4 mt-4 py-4 border border-white/5 bg-[#0A0A0A] ml-[76px] md:ml-[96px]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <Lock size={28} className="text-[#00B4D8]" />
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Secure<br/>Transaction</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <RotateCcw size={28} className="text-[#00B4D8]" />
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Money Back<br/>Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Designed in<br/>Australia</span>
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

// Story Section
const StorySection = () => {
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Our Origin</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            The <span className="text-[#00B4D8]">Bondi Wave</span><br/>Story
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Born on the shores of Bondi Beach, built for athletes everywhere.
          </p>
        </motion.div>

        {/* Videos Row */}
        <motion.div {...fadeUp} className="grid grid-cols-5 gap-3 md:gap-4 mb-8">
          {[
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/73b5ntyx_video%201.mp4", alt: "Bondi Beach coastal" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/8u09c6yi_%E2%9C%A8%20Bondi%20to%20Coogee%20Walk%20%E2%80%93%20Sydney%E2%80%99s%20Most%20Scenic%20Coastal%20Hike%21%20%E2%9C%A8%F0%9F%9A%B6_%E2%99%80%EF%B8%8F%206%20km%20-%20%F0%9F%8C%8A%20Breathtaking%20Views%20.mp4", alt: "Bondi to Coogee Walk" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/obpwciku_POV%F0%9F%AB%80-%20You%E2%80%99re%20strolling%20along%20the%20picturesque%20coastal%20walk%20from%20Bronte%20to%20Ben%20Buckler%E2%80%99s%20Point%20in.mp4", alt: "Bronte to Ben Buckler POV" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/955gy3x6_Muita%20sorte%20morar%20em%20um%20lugar%20que%20tem%20essas%20praias%20pertinho%20de%20casa%20e%20uma%20do%20lado%20da%20outra%2C%20com%20.mp4", alt: "Bondi Beach lifestyle" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/4kt0nt6x_Welcome%20to%E2%80%A6This%20is%20the%20classic%20Bronte%20to%20Bondi%20costal%20walk%20in%20Sydney%20it%E2%80%99s%20one%20of%20the%20most%20iconic.mp4", alt: "Bronte to Bondi coastal walk" },
          ].map((video, i) => (
            <div key={i} className="rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16]">
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Key Points */}
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">2.5km</div>
            <p className="text-neutral-400 text-sm">
              The iconic Bondi to Bronte coastal walk where our run club community discovered the power of nasal breathing.
            </p>
          </div>
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">1M+</div>
            <p className="text-neutral-400 text-sm">
              Yearly visitors to Bondi Beach, one of the world's most famous stretches of coastline and our home.
            </p>
          </div>
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">100%</div>
            <p className="text-neutral-400 text-sm">
              Australian designed. Inspired by the ocean, engineered for athletes who demand more from every breath.
            </p>
          </div>
        </motion.div>
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
  ];
  
  const sleepBenefits = [
    "Reduces snoring intensity",
    "Promotes deeper, restorative sleep",
    "Reduces morning dry mouth",
    "Helps maintain optimal sleep breathing",
  ];
  
  return (
    <section id="benefits" className="py-8 md:py-10" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-10">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Science</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Why Nose<br/>Strips Work
          </h2>
        </motion.div>
        
        {/* Interactive Product Diagram */}
        <motion.div {...fadeUp} className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-center">
            
            {/* Left - Sleep Benefits */}
            <div className="flex justify-end" data-testid="sleep-benefits">
              <div className="max-w-xs w-full text-right pr-6 lg:pr-0">
                <div className="flex items-center justify-end gap-3 mb-5">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#00B4D8]">Recovery</p>
                    <h3 className="font-heading text-2xl font-bold uppercase">For Sleep</h3>
                  </div>
                  <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                </div>
                <ul className="space-y-3">
                  {sleepBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center justify-end gap-2">
                      <span className="text-neutral-300 text-sm">{benefit}</span>
                      <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center - Nose Strip with connector lines */}
            <div className="relative hidden lg:flex items-center justify-center px-4" style={{ minWidth: '360px' }}>
              {/* Nose strip image */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#00B4D8]/15 blur-[60px] rounded-full" />
                <img 
                  src="https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/yjztc40y_actual%20product%20image.png"
                  alt="Bondi Wave Nose Strip"
                  className="relative z-10 w-72 drop-shadow-2xl"
                  data-testid="benefits-image"
                />
              </div>
            </div>

            {/* Mobile-only nose strip */}
            <div className="lg:hidden flex justify-center my-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/yjztc40y_actual%20product%20image.png"
                alt="Bondi Wave Nose Strip"
                className="w-48"
              />
            </div>

            {/* Right - Sport Benefits */}
            <div className="flex justify-start" data-testid="sport-benefits">
              <div className="max-w-xs w-full pl-6 lg:pl-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#00B4D8]">Performance</p>
                    <h3 className="font-heading text-2xl font-bold uppercase">For Sport</h3>
                  </div>
                </div>
                <ul className="space-y-3">
                  {sportBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                      <span className="text-neutral-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
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
                className="relative z-10 w-full max-w-2xl mx-auto"
                data-testid="product-display"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Sleep Recovery Section
const SleepRecovery = () => {
  return (
    <section className="relative" data-testid="sleep-section">
      <div className="relative w-full overflow-visible">
        <img
          src="https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/hdcikd5m_A%2B%20Basic%20Content%20%28A4%20%28Landscape%29%29%20%286%29.png"
          alt="Recover Faster, Sleep Deeper - Bondi Wave"
          className="w-full block"
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0A]/60 to-transparent" />
      </div>
    </section>
  );
};

// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do Bondi Wave nasal strips work?",
      answer: "Bondi Wave strips feature a flexible, spring-like band that gently lifts and opens the nasal passages. By widening the nasal valve, the strips reduce airflow resistance, allowing you to breathe more deeply and easily through your nose without the use of medication."
    },
    {
      question: "What are the main benefits of wearing nasal strips?",
      answer: "Nasal strips provide immediate relief from snoring by reducing the need for mouth breathing. They also improve athletic endurance by maximizing oxygen intake, relieve congestion from colds or allergies, and promote deeper, more restorative sleep."
    },
    {
      question: "Will Bondi Wave strips stay on during heavy exercise or sweating?",
      answer: "Yes. Bondi Wave is engineered with a high-performance adhesive specifically designed to withstand sweat and movement. Whether you are running, lifting, or surfing, the strips are built to stay secure until you're ready to take them off."
    },
    {
      question: "Can nasal strips help with snoring?",
      answer: "Many people snore because their nasal passages are restricted, forcing them to breathe through their mouth. Bondi Wave strips physically pull the nostrils open to keep the airway clear, which can significantly reduce or eliminate snoring for a quieter night's sleep."
    },
    {
      question: "How do I apply the strip for the strongest grip?",
      answer: "For the best results, wash your nose with soap and water to remove any natural oils or moisturizers, then dry the area completely. Position the strip across the bridge of your nose just above the flare of the nostrils and press firmly for 10 seconds to set the adhesive."
    },
    {
      question: "What is the best way to remove the strip?",
      answer: "To protect your skin, remove the strip while washing your face with warm water or during a shower. The warmth helps loosen the bond, allowing you to gently lift the edges and peel the strip away without irritation."
    },
    {
      question: "Are Bondi Wave nasal strips drug-free?",
      answer: "Yes, Bondi Wave strips are 100% drug-free. They work through simple mechanical action to lift the skin and open the airway, making them safe to use every night or during every workout."
    },
    {
      question: "What should I do if I have sensitive skin?",
      answer: "If you have sensitive skin, we recommend applying a drop of warm water to the strip before removal to soften the adhesive. After removal, you can apply a gentle moisturizer to the bridge of your nose to keep the skin hydrated."
    },
    {
      question: "Can I use these strips if I have a deviated septum?",
      answer: "While nasal strips cannot cure a deviated septum, they can help manage the symptoms. By lifting the side walls of the nose, they can open up the restricted airway, making it easier to draw air through the nose."
    },
    {
      question: "How often can I use Bondi Wave strips?",
      answer: "Our strips are designed for single use and can be worn daily. For the best hygiene and adhesive performance, use a fresh strip for each sleep or training session."
    },
  ];

  return (
    <section className="py-8 md:py-10" data-testid="faq-section" itemScope itemType="https://schema.org/FAQPage">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Support</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Frequently Asked<br/>Questions
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="divide-y divide-white/10 border-t border-b border-white/10">
          {faqs.map((faq, i) => (
            <div
              key={i}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                data-testid={`faq-toggle-${i}`}
              >
                <h3 itemProp="name" className="font-heading text-sm md:text-base font-bold uppercase tracking-wide pr-4 group-hover:text-[#00B4D8] transition-colors">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                  <span className={`text-lg leading-none ${openIndex === i ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
                </div>
              </button>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48 pb-5' : 'max-h-0'}`}
              >
                <p itemProp="text" className="text-neutral-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Reviews Section
const Reviews = () => {
  const scrollRef = useRef(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // Slow auto-scroll, pauses on user interaction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId;
    let isProgrammaticScroll = false;
    const speed = 1;

    const autoScroll = () => {
      if (!isUserScrolling.current && el) {
        isProgrammaticScroll = true;
        el.scrollLeft += speed;
        isProgrammaticScroll = false;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(autoScroll);
    };

    const pauseAutoScroll = () => {
      if (isProgrammaticScroll) return;
      isUserScrolling.current = true;
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 2000);
    };

    el.addEventListener('mousedown', pauseAutoScroll);
    el.addEventListener('wheel', pauseAutoScroll);
    el.addEventListener('touchstart', pauseAutoScroll);

    animId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimeout.current);
      el.removeEventListener('mousedown', pauseAutoScroll);
      el.removeEventListener('wheel', pauseAutoScroll);
      el.removeEventListener('touchstart', pauseAutoScroll);
    };
  }, []);

  const reviews = [
    { name: "Sarah M.", location: "Sydney, AU", stars: 5, category: "Sleep", text: "I couldn't believe how much better I slept the very first night. Less tossing and turning, more restful sleep, and I finally wake up feeling energised instead of groggy." },
    { name: "James T.", location: "Melbourne, AU", stars: 5, category: "Sport", text: "I used these for a 25km run and my average pace was significantly faster while my heart rate stayed lower than usual. Being able to maintain nasal breathing during cardio is a total game-changer." },
    { name: "Emma L.", location: "Brisbane, AU", stars: 5, category: "Sleep", text: "My partner reckons I snore way less now, and I wake up feeling completely refreshed. It's the first time in years I've slept through the entire night breathing only through my nose." },
    { name: "Daniel K.", location: "Perth, AU", stars: 5, category: "Sport", text: "The adhesive is unreal. Not sure how but I can sweat through a full session, and the strip doesn't budge." },
    { name: "Olivia R.", location: "Adelaide, AU", stars: 4, category: "Congestion", text: "I have a deviated septum and haven't been able to breathe properly through my nose my whole life. These strips physically lift the sides of my nose and open everything up — worth every cent." },
    { name: "Chris W.", location: "Gold Coast, AU", stars: 5, category: "Sleep", text: "I wear a WHOOP and my recovery scores have improved by 5% over the last three months of using these. No more dry mouth or bad breath in the morning either." },
    { name: "Mia H.", location: "Bondi, AU", stars: 5, category: "Sport", text: "I wore one during the Sydney Marathon and was able to nose-breathe the entire race. It stops my nose from collapsing when I take deep breaths during heavy efforts." },
    { name: "Liam P.", location: "Coogee, AU", stars: 4, category: "Congestion", text: "Perfect for when you've got a cold or sinus infection. It's a drug-free way to actually get some sleep when you're blocked up." },
    { name: "Sophie N.", location: "Manly, AU", stars: 5, category: "Sleep", text: "These strips stay in place all night long, which was my biggest issue with other things I've tried. They work instantly the moment you press them on." },
    { name: "Ryan B.", location: "Newcastle, AU", stars: 5, category: "Sport", text: "It almost hurt the first time I ran with one because of how much air was actually reaching my lungs! I always struggled to get enough air through my nose, but this makes it feel effortless." },
    { name: "Grace F.", location: "Cronulla, AU", stars: 5, category: "Congestion", text: "I was worried about my skin because I'm quite sensitive, but these are gentle and don't leave any irritation after I peel them off in the shower." },
    { name: "Tom A.", location: "Wollongong, AU", stars: 4, category: "Sleep", text: "Simple to use and bloody effective. If you feel like you aren't getting enough air, especially at night, this is the most immediate solution I've found." },
  ];

  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="reviews-section" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content="Bondi Wave Premium Nasal Strips" />
      <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
        <meta itemProp="ratingValue" content="4.8" />
        <meta itemProp="reviewCount" content="12" />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Real Results</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">
            What Our<br/>Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-[#00B4D8] fill-[#00B4D8]" />
            ))}
            <span className="font-mono text-sm text-neutral-400 ml-2">4.8 / 5</span>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 reviews-scroll cursor-grab active:cursor-grabbing"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="w-[320px] md:w-[380px] bg-[#050505] border border-white/5 p-6 md:p-8 flex flex-col justify-between flex-shrink-0"
              itemScope
              itemProp="review"
              itemType="https://schema.org/Review"
              data-testid={`review-card-${i}`}
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s < review.stars ? "text-[#00B4D8] fill-[#00B4D8]" : "text-neutral-700"}
                    />
                  ))}
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider ml-2">{review.category}</span>
                </div>
                <p itemProp="reviewBody" className="text-neutral-300 text-sm leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-sm font-bold text-[#00B4D8]">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p itemProp="author" className="text-white text-sm font-bold">{review.name}</p>
                  <p className="text-neutral-500 text-xs">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
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
    <section id="signup" className="pt-7 pb-16 md:pb-20" data-testid="waitlist-section">
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
      <SleepRecovery />
      <FAQ />
      <Reviews />
      <EmailSignup />
      <Footer />
    </div>
  );
}

export default App;

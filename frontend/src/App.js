import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wind, Moon, Zap, Heart, Shield, Droplets, 
  Instagram, Facebook, ShoppingBag, ArrowRight,
  Check, ChevronDown
} from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Brand Assets
const ASSETS = {
  logo: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/9rfimotz_Bondi%20Wave%20Logo.svg",
  box: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/828eqn8r_Box.png",
  boxBack: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/ikfo0f11_Back%20Of%20Box.png",
  strips: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/v9foakyl_Nose%20Strips.png",
  display: "https://customer-assets.emergentagent.com/job_9cbd79b7-2ff2-4a5e-8fd4-1856bb9c0e0a/artifacts/ba4nx74s_Display%20Cases.png",
};

// Social Links (placeholder)
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/bondiwave",
  facebook: "https://facebook.com/bondiwave",
  tiktok: "https://tiktok.com/@bondiwave",
  amazon: "https://amazon.com.au/bondiwave",
};

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

// TikTok Icon Component
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

// Countdown Component
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const targetDate = new Date('2026-03-01T00:00:00');
    
    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex gap-4 md:gap-6" data-testid="countdown">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="font-heading text-3xl md:text-5xl font-bold text-[#00B4D8]">
            {String(value).padStart(2, '0')}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <a href="/" data-testid="logo-link">
          <img src={ASSETS.logo} alt="Bondi Wave" className="h-8 md:h-10" />
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
    <section className="min-h-screen relative overflow-hidden flex items-center" data-testid="hero-section">
      {/* Background Glow */}
      <div className="absolute inset-0 hero-glow" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div {...fadeUp} className="space-y-8">
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4"
            >
              Coming March 2026
            </motion.p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9]">
              Breathe<br/>
              <span className="text-[#00B4D8]">Better.</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-md leading-relaxed">
            Premium nasal strips engineered for peak performance. Whether you're chasing records or chasing sleep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group"
              data-testid="hero-cta"
            >
              Join the Waitlist
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
          
          <div className="pt-4">
            <Countdown />
          </div>
        </motion.div>
        
        {/* Right Content - Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[100px] rounded-full" />
            <img 
              src={ASSETS.box} 
              alt="Bondi Wave Nose Strips Box" 
              className="relative z-10 w-full max-w-md lg:max-w-lg drop-shadow-2xl"
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
    <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="features-section">
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
    <section id="benefits" className="py-24 md:py-32" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Science</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Why Nose<br/>Strips Work
          </h2>
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
    <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="product-section">
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
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={ASSETS.box} 
                alt="Bondi Wave Box Front" 
                className="w-full"
                data-testid="product-box-front"
              />
              <img 
                src={ASSETS.boxBack} 
                alt="Bondi Wave Box Back" 
                className="w-full"
                data-testid="product-box-back"
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
      const response = await axios.post(`${API}/subscribe`, { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setSubscribed(true);
        setEmail("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="waitlist" className="py-24 md:py-32" data-testid="waitlist-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
        <motion.div {...fadeUp}>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Be First</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            Join The<br/>Waitlist
          </h2>
          <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">
            Get exclusive early access, launch discounts, and be the first to know when Bondi Wave drops.
          </p>
          
          {subscribed ? (
            <div className="bg-[#0A0A0A] border border-[#00B4D8] p-8" data-testid="success-message">
              <Check className="w-12 h-12 text-[#00B4D8] mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold uppercase mb-2">You're In!</h3>
              <p className="text-neutral-400">We'll notify you when we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
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
                {loading ? "..." : "Notify Me"}
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
    <footer className="py-16 border-t border-white/10 bg-[#050505]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={ASSETS.logo} alt="Bondi Wave" className="h-8 mb-4" />
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
                <a href="#waitlist" className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm">
                  Join Waitlist
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
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                data-testid="footer-facebook"
              >
                <Facebook size={18} />
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
            © 2025 Bondi Wave. All rights reserved.
          </p>
          <p className="text-neutral-600 text-sm">
            Made with <Wind className="inline w-4 h-4 text-[#00B4D8]" /> in Australia
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
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
      <Navigation />
      <Hero />
      <Marquee />
      <Features />
      <Benefits />
      <ProductShowcase />
      <EmailSignup />
      <Footer />
    </div>
  );
}

export default App;

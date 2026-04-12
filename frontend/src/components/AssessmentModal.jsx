import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SOCIAL_LINKS } from "@/constants";

export const AssessmentModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
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
      setCurrentStep(6);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setCurrentStep(7);
    
    try {
      const formData = new FormData();
      formData.append('form-name', 'assessment');
      formData.append('email', email);
      formData.append('profile', calculateProfile());
      
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      
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
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#111111] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
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
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00BFFF]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
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
              
              {currentStep === 8 && profile && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-[#00BFFF]/10 border border-[#00BFFF]/30 p-4 mb-6 text-center">
                    <p className="font-mono text-xs text-[#00BFFF] uppercase tracking-wider mb-1">
                      Your Result
                    </p>
                    <h2 className="font-heading text-2xl font-bold uppercase text-white">
                      {profiles[profile].name}
                    </h2>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#00BFFF] mb-2">
                      Diagnosis
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {profiles[profile].diagnosis}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#00BFFF] mb-2">
                      The Solution
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {profiles[profile].solution}
                    </p>
                  </div>
                  
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

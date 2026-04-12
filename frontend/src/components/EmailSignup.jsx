import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { fadeUp } from "@/constants";

export const EmailSignup = () => {
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

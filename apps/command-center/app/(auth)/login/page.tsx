"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "@eumetise/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Mail, Phone, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"identifier" | "totp" | "success">("identifier");
  const [isEmail, setIsEmail] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate Push Approval
  useEffect(() => {
    if (step === 'totp') {
      const timer = setTimeout(() => {
        handleVerifySuccess();
      }, 3500); // Wait 3.5s for "approval"
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Mock Login Handler
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    
    setIsLoading(true);
    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    setStep("totp");
  };

  const handleVerifySuccess = () => {
    setStep("success");
    setTimeout(() => {
        router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-base-cream flex items-center justify-center p-4 font-ibm-plex">
       <Card className="w-full max-w-xl bg-base-white/80 backdrop-blur-xl border-none shadow-2xl rounded-3xl overflow-hidden relative">
          
          {/* Progress Indicator */}
          <div className="absolute top-6 left-0 right-0 flex justify-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 'identifier' ? 'bg-base-black scale-125' : 'bg-gray-200'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 'totp' ? 'bg-base-black scale-125' : 'bg-gray-200'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 'success' ? 'bg-success-500 scale-125' : 'bg-gray-200'}`} />
          </div>

          <div className="p-8 pt-16 flex flex-col items-center">
             {/* Logo / Icon */}
             <div className="w-16 h-16 rounded-2xl bg-base-black flex items-center justify-center mb-6 shadow-xl shadow-gray-200">
                 <span className="text-base-white text-2xl font-haas-disp font-bold">E</span>
             </div>

             <h1 className="text-hero-subtitle font-haas-disp font-bold text-gray-900 mb-2 text-center tracking-tight">
                 {step === 'identifier' ? 'Welcome back' : step === 'totp' ? 'Verify Identity' : 'Success!'}
             </h1>
             <p className="text-body-text text-gray-500 text-center mb-8">
                 {step === 'identifier' 
                    ? 'Sign in to access your dashboard' 
                    : step === 'totp' 
                        ? `Approve the request for ${identifier}` 
                        : 'Redirecting you to dashboard...'}
             </p>

             <AnimatePresence mode="wait">
                 {/* Step 1: Identifier (Email/Phone) */}
                 {step === 'identifier' && (
                     <motion.form 
                        key="identifier"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleIdentifierSubmit}
                        className="w-full space-y-4 max-w-sm mx-auto"
                     >
                         {/* Toggle */}
                         <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
                             <div 
                                className={`absolute inset-y-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ${isEmail ? 'left-1' : 'left-[calc(50%-4px)] translate-x-1'}`} 
                             />
                             <button 
                                type="button"
                                onClick={() => setIsEmail(true)}
                                className={`flex-1 relative z-10 text-sm font-medium py-2 text-center rounded-lg transition-colors ${isEmail ? 'text-gray-900' : 'text-gray-500'}`}
                             >
                                 Email
                             </button>
                             <button 
                                type="button"
                                onClick={() => setIsEmail(false)}
                                className={`flex-1 relative z-10 text-sm font-medium py-2 text-center rounded-lg transition-colors ${!isEmail ? 'text-gray-900' : 'text-gray-500'}`}
                             >
                                 Phone
                             </button>
                         </div>

                         <div className="relative">
                            <Input 
                                type={isEmail ? "email" : "tel"}
                                placeholder={isEmail ? "name@institution.com" : "+44 7700 900000"}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="h-14 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {isEmail ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                            </div>
                         </div>

                         <Button 
                            disabled={isLoading}
                            className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all mt-4"
                         >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Continue"}
                         </Button>
                     </motion.form>
                 )}

                 {/* Step 2: Push Approval (MFA) */}
                 {step === 'totp' && (
                     <motion.form
                        key="totp"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        onSubmit={(e) => e.preventDefault()}
                        className="w-full space-y-6 flex flex-col items-center max-w-sm mx-auto"
                     >
                         <div className="text-center space-y-2">
                             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse mx-auto mb-4">
                                 <ShieldCheck className="w-10 h-10" />
                             </div>
                             <h2 className="text-xl font-semibold text-gray-900">Open your Authenticator app</h2>
                             <p className="text-sm text-gray-500">
                                 Approve the request to sign in.
                             </p>
                         </div>
                         
                         <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 w-full shadow-sm">
                             <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Tap this number</span>
                             <span className="text-6xl font-mono font-bold text-gray-900 tracking-wider">
                                 {Math.floor(Math.random() * 90 + 10)}
                             </span>
                         </div>

                         <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Waiting for approval...
                         </div>
                         
                         <button 
                            type="button"
                            onClick={() => setStep('identifier')}
                            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 underline decoration-gray-300 underline-offset-4"
                         >
                             Cancel request
                         </button>
                     </motion.form>
                 )}

                 {/* Step 3: Success */}
                 {step === 'success' && (
                     <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8"
                     >
                         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                             <Check className="w-10 h-10" />
                         </div>
                         <h2 className="text-xl font-medium text-gray-900">Authenticated</h2>
                     </motion.div>
                 )}
             </AnimatePresence>
          </div>
       </Card>
    </div>
  );
}
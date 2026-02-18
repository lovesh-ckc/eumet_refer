"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Input, Card } from "@eumetise/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2, ArrowRight, ShieldCheck, User, Ruler, MapPin } from "lucide-react";
import Link from "next/link";

// Types for our conversation steps
type Step = "welcome" | "name_confirm" | "address" | "units" | "mfa_intro" | "mfa_setup" | "complete";

type Message = {
  id: string;
  sender: "system" | "user";
  content: React.ReactNode;
  timestamp: number;
};

export default function InteractiveSetupPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // User Data State
  const [userData, setUserData] = useState({
    firstName: "Sam",
    lastName: "Smith",
    email: "sam.smith@institution.com",
    address: "",
    units: {
      weight: "st lb",
      height: "ft in",
      measurements: "in",
      temp: "°C",
      glucose: "mmol/L"
    },
    mfaEnabled: false
  });

  // Helper to generate unique ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Helper to add message with typing delay
  const addSystemMessage = (content: React.ReactNode, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: generateId(),
        sender: "system",
        content,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (content: React.ReactNode) => {
    setMessages(prev => [...prev, {
      id: generateId(),
      sender: "user",
      content,
      timestamp: Date.now()
    }]);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial Welcome
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    addSystemMessage(
      <>
        <span className="text-lg font-medium">Hi there! 👋</span>
        <br />
        I'm your Eumetise assistant. Let's get your profile set up so you can start orchestrating care.
      </>, 
      800
    );
    setTimeout(() => {
        addSystemMessage(
            <>
              First things first, I have your name as <span className="font-bold text-gray-900">{userData.firstName} {userData.lastName}</span>.
              <br/>
              Is that correct?
            </>
        );
        setCurrentStep("name_confirm");
    }, 2000);
  }, []);

  const handleNameConfirm = (isCorrect: boolean) => {
    if (isCorrect) {
        addUserMessage("Yes, that's me.");
        setTimeout(() => {
            addSystemMessage("Great! Nice to meet you, Sam.");
            setTimeout(() => {
                addSystemMessage("We need your address for administrative purposes. Where are you based?");
                setCurrentStep("address");
            }, 1000);
        }, 500);
    } else {
        // Handle name edit flow (simplified for now)
        addUserMessage("No, I need to change it.");
        addSystemMessage("No problem. Please contact your administrator to update your core details.");
    }
  };

  const handleAddressSubmit = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    setUserData(prev => ({ ...prev, address: inputValue }));
    setInputValue("");
    
    setTimeout(() => {
        addSystemMessage("Got it. Thanks! 🏠");
        setTimeout(() => {
            addSystemMessage("Now, let's set your preferred clinical units. This helps us display patient data familiar to you.");
            setCurrentStep("units");
        }, 1200);
    }, 600);
  };

  const handleUnitsSubmit = (newUnits: typeof userData.units) => {
    setUserData(prev => ({ ...prev, units: newUnits }));
    addUserMessage(
        <div className="text-sm">
            Weight: {newUnits.weight}, Height: {newUnits.height}, Temp: {newUnits.temp}
        </div>
    );
    
    setTimeout(() => {
        addSystemMessage("Perfect. Your dashboard will now use these units automatically.");
        setTimeout(() => {
            addSystemMessage(
                <>
                    <ShieldCheck className="w-5 h-5 inline-block mr-2 text-blue-600" />
                    Last step: Security.
                    <br/>
                    We use <strong>Passwordless MFA</strong> to keep your account secure. No passwords to remember!
                </>
            );
            setTimeout(() => {
               addSystemMessage("You'll verify your login using the Microsoft Authenticator app (or any TOTP app). Ready to set it up?");
               setCurrentStep("mfa_intro");
            }, 1500);
        }, 1200);
    }, 600);
  };

  const handleMfaStart = () => {
    addUserMessage("I'm ready. Let's do it.");
    setTimeout(() => {
        addSystemMessage("Please scan this QR code with your Authenticator app:");
        // Mock QR Code display in chat
        addSystemMessage(
            <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
                <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs text-center">
                    [QR CODE PLACEHOLDER]
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Scan with Authenticator</p>
            </div>
        );
        setCurrentStep("mfa_setup");
    }, 800);
  };

  const handleMfaVerify = () => {
      // Mock verification
      addUserMessage("Entered code: 123456"); // masked in real UI
      setTimeout(() => {
          addSystemMessage(
             <div className="flex items-center gap-2 text-green-600 font-medium">
                 <Check className="w-5 h-5" /> Verified successfully!
             </div>
          );
          setUserData(prev => ({ ...prev, mfaEnabled: true }));
          setTimeout(() => {
              addSystemMessage("All set! Your profile involves no passwords, just secure, seamless access. Please sign in now.");
              setCurrentStep("complete");
          }, 1000);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-base-cream/50 flex flex-col relative overflow-hidden font-ibm-plex">
      
      {/* Header */}
      <header className="px-6 py-4 bg-base-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-base-black flex items-center justify-center text-base-white font-bold text-xs font-haas-disp">E</div>
             <span className="font-semibold text-gray-900 font-haas-text">Account Setup</span>
        </div>
        <div className="text-caption text-gray-400 font-medium">Step {currentStep === 'complete' ? 4 : ['welcome', 'name_confirm'].includes(currentStep) ? 1 : currentStep === 'address' ? 2 : currentStep === 'units' ? 3 : 4} of 4</div>
      </header>
      
      {/* Chat Area */}
      {/* Chat Area - Increased padding bottom to prevent overlap with dynamic footer */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col gap-4 overflow-y-auto pb-64 scroll-smooth">
        <AnimatePresence>
            {messages.map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-[16px] leading-relaxed relative ${
                        msg.sender === 'user' 
                        ? 'bg-gray-900 text-white rounded-br-sm' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                         {msg.content}
                    </div>
                </motion.div>
            ))}
            
            {isTyping && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                 >
                     <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                     </div>
                 </motion.div>
            )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Interactive Footer (Input Area) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 md:p-4 z-20">
          <div className="max-w-3xl w-full mx-auto">
             
             {/* Dynamic Input based on 'currentStep' */}
             <AnimatePresence mode="wait">
                
                {/* 1. Name Confirm */}
                {currentStep === 'name_confirm' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex gap-4 justify-center"
                    >
                         <Button variant="outline" onClick={() => handleNameConfirm(false)} className="w-full md:w-auto h-12 rounded-xl border-gray-200 font-ibm-plex">
                            Edit Name
                         </Button>
                         <Button onClick={() => handleNameConfirm(true)} className="w-full md:w-auto h-12 rounded-xl bg-base-black text-base-white shadow-lg shadow-gray-200/50 font-ibm-plex">
                            Yes, that's me <ArrowRight className="ml-2 w-4 h-4" />
                         </Button>
                    </motion.div>
                )}

                {/* 2. Address Input */}
                {currentStep === 'address' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex gap-2" 
                    >
                        <Input 
                            autoFocus
                            placeholder="Type your address..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddressSubmit()}
                            className="bg-gray-50 border-transparent focus:bg-base-white h-12 rounded-xl font-ibm-plex"
                        />
                        <Button onClick={handleAddressSubmit} disabled={!inputValue.trim()} className="h-12 w-12 rounded-xl bg-base-black p-0 flex items-center justify-center">
                            <Send className="w-5 h-5 text-base-white" />
                        </Button>
                    </motion.div>
                )}
                
                {/* 3. Unit Preferences */}
                {currentStep === 'units' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 font-ibm-plex"
                    >
                        {/* Simplified unit toggles for demo */}
                         <UnitToggle label="Weight" options={["st lb", "kg"]} value={userData.units.weight} onChange={(v) => setUserData(prev => ({ ...prev, units: { ...prev.units, weight: v}}))} />
                         <UnitToggle label="Temp" options={["°C", "°F"]} value={userData.units.temp} onChange={(v) => setUserData(prev => ({ ...prev, units: { ...prev.units, temp: v}}))} />
                         
                         <div className="col-span-2 md:col-start-4 flex justify-end">
                            <Button onClick={() => handleUnitsSubmit(userData.units)} className="w-full h-10 rounded-xl bg-base-black text-base-white text-sm">
                                Confirm Units <ArrowRight className="ml-2 w-3 h-3" />
                            </Button>
                         </div>
                    </motion.div>
                )}
                
                {/* 4. MFA Intro */}
                 {currentStep === 'mfa_intro' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex justify-center"
                    >
                         <Button onClick={handleMfaStart} className="w-full md:w-auto h-12 rounded-xl bg-accent-500 hover:bg-accent-600 text-base-white shadow-lg shadow-accent-200/50 font-ibm-plex">
                            Set up Authenticator <ShieldCheck className="ml-2 w-4 h-4" />
                         </Button>
                    </motion.div>
                )}

                {/* 5. MFA Setup (Enter Code) */}
                {currentStep === 'mfa_setup' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex gap-2" 
                    >
                        <Input 
                            autoFocus
                            placeholder="Enter 6-digit code..." 
                            className="bg-gray-50 border-transparent focus:bg-base-white h-12 rounded-xl text-center tracking-widest font-mono font-medium text-lg"
                            onKeyDown={(e) => e.key === 'Enter' && handleMfaVerify()}
                        />
                         <Button onClick={handleMfaVerify} className="h-12 rounded-xl bg-base-black px-6 text-base-white font-ibm-plex">
                            Verify
                        </Button>
                    </motion.div>
                )}

                {/* 6. Complete */}
                {currentStep === 'complete' && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex justify-center"
                    >
                         <Link href="/login" className="w-full md:w-auto">
                            <Button className="w-full h-12 rounded-xl bg-success-500 hover:bg-success-600 text-base-white shadow-lg shadow-success-200/50 font-ibm-plex">
                                Go to Login <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                         </Link>
                    </motion.div>
                )}

             </AnimatePresence>
          </div>
      </footer>
    </div>
  );
}

// Helper Components
function UnitToggle({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
    return (
        <div className="bg-gray-50 p-1 rounded-lg border border-gray-100 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
            <div className="flex bg-white rounded-md p-0.5 border border-gray-200 w-full">
                {options.map(opt => (
                    <button 
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`flex-1 text-[10px] py-1 rounded transition-all font-medium ${value === opt ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    )
}

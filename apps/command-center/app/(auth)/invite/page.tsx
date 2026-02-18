"use client";

import { Button } from "@eumetise/ui";
import { motion } from "framer-motion";
import { Activity, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function InvitePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden relative">
      {/* Background decoration for dashboard feel */}
      <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} 
        className="relative z-10 w-full max-w-4xl px-4"
      >
        <div className="w-full bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 overflow-hidden grid md:grid-cols-2">
            
            {/* Left Column - Visual/Brand */}
            <div className="bg-base-cream/50 p-12 flex flex-col justify-between border-r border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-base-black flex items-center justify-center shadow-lg mb-12">
                     <Activity className="w-7 h-7 text-base-white" strokeWidth={2} />
                </div>
                
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3 text-center md:text-left font-ibm-plex">COMMAND CENTER</p>
                        <h1 className="text-hero-subtitle font-haas-disp font-medium text-gray-900 leading-[1.05] tracking-tight text-center md:text-left">
                        Welcome to<br/>Eumetise
                        </h1>
                    </div>
                    <p className="text-body-large leading-relaxed text-gray-600 font-normal max-w-sm text-center md:text-left mx-auto md:mx-0 font-haas-text">
                        Orchestrate care delivery with precision and empathy.
                    </p>
                </div>

                 <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200/60 flex gap-6 justify-center md:justify-start">
                    <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
                        <Twitter className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
                        <Linkedin className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Right Column - Content/Action */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-base-white/40 font-ibm-plex">
                
                <div className="space-y-6 md:space-y-8">
                    <div className="relative">
                         <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100/50 rounded-full blur-2xl mixture-blend-multiply pointer-events-none" />
                        <p className="text-section-header leading-relaxed text-gray-800 relative z-10 font-normal">
                        <span className="font-semibold text-gray-900">Sam Smith</span> has invited you to join the Clinician Portal as <span className="font-semibold text-gray-900 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100/50">Admin</span>. {/* TODO: RBAC Role binding */}
                        </p>
                    </div>

                    <p className="text-body-text text-gray-500 font-medium">
                        You can read about permissions and roles <Link href="#" className="underline decoration-gray-300 hover:decoration-gray-900 text-gray-900 transition-all">here</Link>.
                    </p>

                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
                        <p className="text-[15px] leading-relaxed text-blue-900/80 font-medium flex items-start gap-3">
                            <span className="text-lg">⏱️</span>
                            <span>It takes around <span className="text-blue-900 font-bold">5 minutes</span> to sign up, and you will need your phone for verification.</span>
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link href="/setup" className="block w-full">
                            <Button className="w-full h-[60px] bg-base-black hover:bg-gray-800 text-base-white rounded-2xl text-[17px] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                                Create account
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

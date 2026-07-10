"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Zap, Share2, CheckCircle, SmartphoneNfc, CreditCard } from "lucide-react";
import Link from "next/link";

// Reusable animation variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function LandingPage() {
  return (
    // Wrap the entire page in a relative container with a solid white background 
    // and z-10 so it covers the global dark background from globals.css
    <div className="relative z-10 min-h-screen bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* Abstract light background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-50 blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-50 blur-[100px] -z-10 animate-float" />

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <SmartphoneNfc className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">NEXUS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</Link>
          </nav>
          <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md shadow-slate-200">
            Get Your Card
          </button>
        </div>
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              NFC Technology is here
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              The last business card <br className="hidden md:block" /> you'll ever <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">need.</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Tap your NEXUS card to any smartphone to instantly share your contact info, social media, and portfolio. No app required.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Order Now <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                View Demo
              </button>
            </motion.div>
            
            <motion.div variants={fadeUpVariant} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> One-time purchase</div>
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free global shipping</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 relative w-full max-w-lg aspect-square"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Abstract visual representing a card tapping a phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-50 rounded-full blur-3xl opacity-50" />
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-64 h-96 bg-slate-900 rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col">
                <div className="h-6 w-32 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl" />
                <div className="flex-1 bg-slate-50 mt-8 p-6 relative">
                  {/* Mock profile UI */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-300 mx-auto mb-4 border-4 border-white shadow-md" />
                  <div className="w-32 h-4 bg-slate-200 rounded-full mx-auto mb-2" />
                  <div className="w-24 h-3 bg-slate-100 rounded-full mx-auto mb-8" />
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100" />
                    <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100" />
                    <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100" />
                  </div>
                  
                  {/* Glowing NFC tap visual */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/30 rounded-full blur-xl"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Floating Card */}
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [-10, -5, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-1/3 -right-12 w-48 h-32 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border border-slate-700 p-4 transform rotate-12 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400" />
              <div className="flex justify-end">
                <SmartphoneNfc className="text-slate-500 w-6 h-6" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to network better</h2>
              <p className="text-slate-600 text-lg">Leave the paper cards in the past. NEXUS offers a modern, seamless way to share who you are and what you do.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-indigo-600" />,
                  title: "Instant Sharing",
                  desc: "Just tap your card on any compatible smartphone. Their phone will instantly open your NEXUS profile."
                },
                {
                  icon: <Smartphone className="w-6 h-6 text-cyan-500" />,
                  title: "No App Required",
                  desc: "The other person doesn't need to download an app or sign up. It uses native NFC technology built into their phone."
                },
                {
                  icon: <Share2 className="w-6 h-6 text-pink-500" />,
                  title: "Update Anytime",
                  desc: "Change jobs? Got a new number? Update your details in seconds on our web portal. Your physical card stays the same."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600 text-lg">Getting started with NEXUS is incredibly simple.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-cyan-100 to-indigo-100" />
            
            {[
              { num: "1", title: "Setup Profile", desc: "Create your free NEXUS account and add your links, contact info, and socials." },
              { num: "2", title: "Get Your Card", desc: "Order your premium NFC business card. We'll link it directly to your profile." },
              { num: "3", title: "Start Tapping", desc: "Tap your card on any modern smartphone to instantly share your digital presence." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-indigo-50 shadow-lg mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full opacity-10" />
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-cyan-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500 to-transparent rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500 to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Ready to upgrade your networking game?</h2>
              <p className="text-slate-300 text-lg mb-10">Join thousands of professionals who have already ditched paper cards.</p>
              <button className="px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1">
                Order Your Card Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <SmartphoneNfc className="text-indigo-600 w-5 h-5" />
            <span className="text-lg font-bold text-slate-900">NEXUS</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} NEXUS Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
            <Link href="#" className="hover:text-slate-900">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

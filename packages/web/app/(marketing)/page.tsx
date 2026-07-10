"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Zap, Share2, CheckCircle, SmartphoneNfc, CreditCard, Globe2 } from "lucide-react";
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
    <>

      <main>
        {/* ── Hero Section ── */}
        <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold mb-6 border border-rose-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              NFC Technology is here
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.1] mb-6">
              The ultimate networking tool. <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Tag it, Share it.</span>
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto lg:mx-0">
              Tap your TAGIT card to any smartphone to instantly share your contact info, social media, and portfolio. No app required.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-rose-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Order Now <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-neutral-600 font-semibold text-lg border border-neutral-200 hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                View Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-neutral-400 text-sm font-medium">
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-rose-500" /> One-time purchase</div>
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-rose-500" /> Free global shipping</div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 relative w-full max-w-lg aspect-square"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Abstract visual representing a card tapping a phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-cyan-50 rounded-full blur-3xl opacity-50" />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* High-Fidelity Phone Mockup */}
              <div className="relative w-[260px] h-[460px] bg-neutral-950 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border-[8px] border-neutral-950 ring-1 ring-neutral-300/50 overflow-hidden flex flex-col items-center">
                
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-[22px] bg-black rounded-full z-50 flex items-center justify-between px-2 shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
                   <div className="w-1 h-1 rounded-full bg-emerald-500 blur-[0.5px] mr-1" />
                </div>

                {/* Profile Cover Gradient */}
                <div className="w-full h-32 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 relative">
                   <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                   <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Profile Content */}
                <div className="w-full flex-1 bg-white relative px-5 pt-0 pb-6 flex flex-col items-center">
                   
                   {/* Avatar overlapping cover */}
                   <div className="w-20 h-20 rounded-full bg-white p-1 -mt-10 relative z-10 shadow-lg mb-4">
                     <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200 overflow-hidden flex items-center justify-center border border-neutral-100">
                        {/* Abstract silhouette */}
                        <div className="w-8 h-8 rounded-full bg-neutral-300/50" />
                     </div>
                   </div>

                   {/* Name and Bio */}
                   <div className="w-32 h-3 bg-neutral-900 rounded-full mb-2.5" />
                   <div className="w-20 h-1.5 bg-neutral-400 rounded-full mb-6" />

                   {/* Action Buttons */}
                   <div className="w-full mb-6">
                      <div className="w-full h-10 rounded-2xl bg-neutral-950 shadow-md shadow-neutral-900/20 flex items-center justify-center text-white font-semibold text-[12px] tracking-wide">
                        Save Contact
                      </div>
                   </div>

                   {/* Link Cards (Sleeker, more detailed) */}
                   <div className="w-full space-y-2.5">
                     <div className="w-full p-2.5 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                         <Smartphone className="w-4 h-4 text-rose-500" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <div className="w-16 h-2 bg-neutral-800 rounded-full" />
                         <div className="w-24 h-1.5 bg-neutral-400 rounded-full" />
                       </div>
                     </div>

                     <div className="w-full p-2.5 rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                         <Globe2 className="w-4 h-4 text-orange-500" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <div className="w-20 h-2 bg-neutral-800 rounded-full" />
                         <div className="w-14 h-1.5 bg-neutral-400 rounded-full" />
                       </div>
                     </div>
                   </div>

                   {/* Glowing NFC tap visual */}
                   <motion.div
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                     transition={{ repeat: Infinity, duration: 2.5 }}
                     className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400/30 rounded-full blur-xl pointer-events-none"
                   />
                </div>
              </div>
            </motion.div>

            {/* Premium Floating Card */}
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [-10, -5, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-1/3 -right-12 md:-right-4 w-56 h-36 rounded-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-neutral-600/30 p-5 transform rotate-12 flex flex-col justify-between overflow-hidden backdrop-blur-xl bg-black/90"
            >
              {/* Holographic glowing orbs inside card */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full blur-[30px] opacity-30 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-bl from-indigo-500 to-cyan-500 rounded-full blur-[30px] opacity-20 pointer-events-none" />
              
              {/* Card glare effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 p-[1.5px] shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                   <div className="w-full h-full bg-black rounded-full" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 font-extrabold tracking-[0.2em] text-lg">TAGIT</span>
              </div>
              
              <div className="flex items-end justify-between relative z-10">
                {/* Gold Chip */}
                <div className="w-8 h-[22px] rounded bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-600 border border-yellow-300/40 shadow-sm opacity-90 overflow-hidden flex flex-col justify-evenly px-[2px]">
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                </div>
                <SmartphoneNfc className="text-neutral-400 w-6 h-6 drop-shadow-lg" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-24 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4">Everything you need to network better</h2>
              <p className="text-neutral-500 text-lg">Leave the paper cards in the past. TAGIT offers a modern, seamless way to share who you are and what you do.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-rose-500" />,
                  title: "Instant Sharing",
                  desc: "Just tap your card on any compatible smartphone. Their phone will instantly open your TAGIT profile."
                },
                {
                  icon: <Smartphone className="w-6 h-6 text-orange-500" />,
                  title: "No App Required",
                  desc: "The other person doesn't need to download an app or sign up. It uses native NFC technology built into their phone."
                },
                {
                  icon: <Share2 className="w-6 h-6 text-orange-500" />,
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
                  className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 mb-3">{feature.title}</h3>
                  <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4">How it works</h2>
            <p className="text-neutral-500 text-lg">Getting started with TAGIT is incredibly simple.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-rose-100 via-orange-100 to-indigo-100" />

            {[
              { num: "1", title: "Setup Profile", desc: "Create your free TAGIT account and add your links, contact info, and socials." },
              { num: "2", title: "Get Your Card", desc: "Order your premium NFC business card. We'll link it directly to your profile." },
              { num: "3", title: "Start Tapping", desc: "Tap your card on any modern smartphone to instantly share your digital presence." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-indigo-50 shadow-lg mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full opacity-10" />
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-rose-500 to-orange-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950 mb-2">{step.title}</h3>
                <p className="text-neutral-500 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-neutral-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500 to-transparent rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500 to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Ready to upgrade your networking game?</h2>
              <p className="text-neutral-300 text-lg mb-10">Join thousands of professionals who have already ditched paper cards.</p>
              <button className="px-10 py-5 rounded-full bg-white text-neutral-950 font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1">
                Order Your Card Now
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

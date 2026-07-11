"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Zap, Share2, CheckCircle, SmartphoneNfc, CreditCard, Globe2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

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
  const { isLight } = useTheme();
  const { addItem } = useCart();

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
            <motion.div variants={fadeUpVariant} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6 border transition-colors ${
              isLight ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              NFC Technology is here
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 transition-colors ${
              isLight ? "text-neutral-950" : "text-white"
            }`}>
              The ultimate networking tool. <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Tag it, Share it.</span>
            </motion.h1>

            <motion.p variants={fadeUpVariant} className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 transition-colors ${
              isLight ? "text-neutral-500" : "text-neutral-400"
            }`}>
              Tap your TAGIT card to any smartphone to instantly share your contact info, social media, and portfolio. No app required.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => addItem({
                  id: "card-matte-black",
                  name: "TAGIT Matte Black",
                  price: "LKR 4,500 one-time",
                  priceNum: 4500,
                  type: "card",
                  badge: "POPULAR",
                })}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-rose-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link href="/products" className={`w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-lg border transition-all flex items-center justify-center gap-2 ${
                isLight ? "bg-white text-neutral-600 border-neutral-200 hover:border-rose-200 hover:bg-rose-50" : "bg-white/5 text-neutral-200 border-white/10 hover:border-rose-500/30 hover:bg-white/10"
              }`}>
                View All Cards <ArrowRight className="w-5 h-5" />
              </Link>
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
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-50 ${isLight ? "bg-gradient-to-tr from-rose-100 to-cyan-50" : "bg-gradient-to-tr from-rose-950/30 to-indigo-950/30"}`} />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* High-Fidelity Phone Mockup */}
              <div className="relative w-[260px] h-[460px] bg-neutral-950 rounded-[3rem] shadow-xl border-[8px] border-neutral-950 ring-1 ring-neutral-300/50 overflow-hidden flex flex-col items-center">
                
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
                   <div className="w-20 h-20 rounded-full bg-white p-1 -mt-10 relative z-10 shadow-md mb-4">
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
                      <div className="w-full h-10 rounded-2xl bg-neutral-950 shadow-sm flex items-center justify-center text-white font-semibold text-[12px] tracking-wide">
                        Save Contact
                      </div>
                   </div>

                   {/* Link Cards */}
                   <div className="w-full space-y-2.5">
                     <div className="w-full p-2.5 rounded-2xl border border-neutral-100 bg-white shadow-xs flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                         <Smartphone className="w-4 h-4 text-rose-500" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <div className="w-16 h-2 bg-neutral-800 rounded-full" />
                         <div className="w-24 h-1.5 bg-neutral-400 rounded-full" />
                       </div>
                     </div>

                     <div className="w-full p-2.5 rounded-2xl border border-neutral-100 bg-white shadow-xs flex items-center gap-3">
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
              className="absolute top-1/3 -right-12 md:-right-4 w-56 h-36 rounded-xl shadow-lg border border-neutral-600/30 p-5 transform rotate-12 flex flex-col justify-between overflow-hidden backdrop-blur-xl bg-black/90"
            >
              {/* Holographic glowing orbs inside card */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full blur-[30px] opacity-30 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-bl from-indigo-500 to-cyan-500 rounded-full blur-[30px] opacity-20 pointer-events-none" />
              
              {/* Card glare effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 p-[1.5px] shadow-sm">
                   <div className="w-full h-full bg-black rounded-full" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 font-extrabold tracking-[0.2em] text-lg">TAGIT</span>
              </div>
              
              <div className="flex items-end justify-between relative z-10">
                {/* Gold Chip */}
                <div className="w-8 h-[22px] rounded bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-600 border border-yellow-300/40 shadow-xs opacity-90 overflow-hidden flex flex-col justify-evenly px-[2px]">
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                   <div className="w-full h-[0.5px] bg-yellow-900/20" />
                </div>
                <SmartphoneNfc className="text-neutral-400 w-6 h-6 drop-shadow-sm" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className={`py-24 border-y transition-colors relative overflow-hidden ${
          isLight ? "bg-neutral-50 border-neutral-200" : "bg-neutral-900/30 border-white/[0.08]"
        }`}>
          {!isLight && (
            <>
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            </>
          )}
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 transition-colors ${isLight ? "text-neutral-950" : "text-white tracking-tight drop-shadow-sm"}`}>Everything you need to network better</h2>
              <p className={`text-lg transition-colors ${isLight ? "text-neutral-500" : "text-neutral-300 font-normal"}`}>Leave the paper cards in the past. TAGIT offers a modern, seamless way to share who you are and what you do.</p>
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
                  className={`p-8 rounded-3xl transition-all border relative overflow-hidden group ${
                    isLight
                      ? "bg-white border-neutral-200 shadow-md shadow-neutral-100 hover:shadow-lg hover:-translate-y-1"
                      : "bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border-white/[0.12] text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:-translate-y-1.5"
                  }`}
                >
                  {!isLight && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500" />
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 ${
                    isLight ? "bg-neutral-50 border border-neutral-100" : "bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-transparent border border-white/15 shadow-inner shadow-rose-500/20"
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 relative z-10 ${isLight ? "text-neutral-950" : "text-white tracking-wide"}`}>{feature.title}</h3>
                  <p className={`relative z-10 leading-relaxed ${isLight ? "text-neutral-500" : "text-neutral-300"}`}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 transition-colors ${isLight ? "text-neutral-950" : "text-white tracking-tight drop-shadow-sm"}`}>How it works</h2>
            <p className={`text-lg transition-colors ${isLight ? "text-neutral-500" : "text-neutral-300 font-normal"}`}>Getting started with TAGIT is incredibly simple.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className={`hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 transition-all duration-500 ${
              isLight ? "bg-gradient-to-r from-rose-100 via-orange-100 to-indigo-100" : "bg-gradient-to-r from-rose-500/40 via-orange-500/40 to-indigo-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
            }`} />

            {[
              { num: "1", title: "Setup Profile", desc: "Create your free TAGIT account and add your links, contact info, and socials." },
              { num: "2", title: "Get Your Card", desc: "Order your premium NFC business card. We'll link it directly to your profile." },
              { num: "3", title: "Start Tapping", desc: "Tap your card on any modern smartphone to instantly share your digital presence." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border-4 mb-6 relative transition-all duration-300 group-hover:scale-110 ${
                  isLight ? "bg-white border-indigo-50 shadow-md" : "bg-gradient-to-br from-[#161620] to-[#0a0a0e] border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.2)]"
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-rose-500 to-orange-500">
                    {step.num}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-neutral-950" : "text-white tracking-wide"}`}>{step.title}</h3>
                <p className={isLight ? "text-neutral-500 max-w-xs mx-auto leading-relaxed" : "text-neutral-300 max-w-xs mx-auto leading-relaxed"}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-6">
          <div className={`max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden transition-all ${
            isLight
              ? "bg-neutral-950 shadow-xl border border-neutral-800/80 text-white"
              : "bg-gradient-to-br from-[#121218] via-[#0b0b0f] to-[#141016] border border-white/15 shadow-[0_20px_70px_-15px_rgba(244,63,94,0.3)] text-white"
          }`}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500 to-transparent rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500 via-orange-500 to-transparent rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-md">Ready to upgrade your networking game?</h2>
              <p className="text-neutral-200 text-lg mb-10 font-normal leading-relaxed">Join thousands of professionals who have already ditched paper cards and stepped into the future.</p>
              <button
                onClick={() => addItem({
                  id: "card-matte-black",
                  name: "TAGIT Matte Black",
                  price: "LKR 4,500 one-time",
                  priceNum: 4500,
                  type: "card",
                  badge: "POPULAR",
                })}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                Order Your Card Now
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

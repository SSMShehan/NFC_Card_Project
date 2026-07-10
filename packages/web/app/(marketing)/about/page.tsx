"use client";

import { motion } from "framer-motion";
import { TreePine, Recycle, Globe2, Users } from "lucide-react";
import Image from "next/image";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPage() {
  return (
    <main className="py-24 px-6 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-32">
        <motion.div 
          className="max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold mb-6 border border-rose-100">
            <TreePine className="w-4 h-4" /> Our Mission
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.1] mb-6">
            Connecting people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">saving trees.</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-xl text-neutral-500 leading-relaxed max-w-2xl">
            Over 10 billion business cards are printed every year, and 88% are thrown away within a week. We built TAGIT to end the waste and make networking seamless.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-950 py-24 rounded-[3rem] relative mx-auto max-w-7xl px-8 mb-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        
        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {[
            { number: "2.5M+", label: "Cards Saved" },
            { number: "10k+", label: "Active Users" },
            { number: "50+", label: "Countries" },
            { number: "1", label: "Card Needed" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
              <div className="text-neutral-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto mb-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4">What drives us</h2>
          <p className="text-neutral-500 text-lg">The core values that guide everything we build at TAGIT.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Recycle className="w-8 h-8 text-rose-500" />,
              title: "Sustainability First",
              desc: "Every TAGIT card replaces hundreds of paper cards. We use eco-friendly materials whenever possible, like our signature Bamboo cards."
            },
            {
              icon: <Globe2 className="w-8 h-8 text-rose-500" />,
              title: "Universal Access",
              desc: "Networking shouldn't require downloading an app. Our technology works natively with the smartphone ecosystem already in everyone's pocket."
            },
            {
              icon: <Users className="w-8 h-8 text-orange-500" />,
              title: "Privacy by Design",
              desc: "You control exactly what you share and with whom. We don't sell your data, and we employ bank-grade encryption."
            }
          ].map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold text-neutral-950 mb-3">{value.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="max-w-7xl mx-auto bg-neutral-50 rounded-[3rem] p-12 md:p-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-6">Built by a passionate team</h2>
        <p className="text-neutral-500 text-lg max-w-2xl mx-auto mb-12">
          We're a small group of designers and engineers who believe that digital interactions in the physical world should feel magical.
        </p>
        <button className="px-8 py-4 rounded-full bg-neutral-950 text-white font-bold hover:bg-neutral-900 transition-colors">
          Join our Team
        </button>
      </section>
    </main>
  );
}

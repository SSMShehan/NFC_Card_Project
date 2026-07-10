"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div 
        className="text-center max-w-3xl mx-auto mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-950 mb-6">
          Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">pricing.</span>
        </h1>
        <p className="text-lg text-neutral-500">
          Start for free, upgrade when you need more. The physical card is a one-time purchase.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white border border-neutral-200 rounded-[2rem] p-10 shadow-xl shadow-neutral-200 flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-neutral-950 mb-2">Standard Profile</h3>
            <p className="text-neutral-400 mb-6">Everything you need to network digitally.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-neutral-950">$0</span>
              <span className="text-neutral-400 font-medium">/forever</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 mb-10">
            {[
              "Unlimited taps",
              "Custom profile link",
              "Up to 5 social/contact links",
              "QR Code sharing",
              "Standard analytics (views)",
              "Basic templates"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-neutral-600">{feature}</span>
              </div>
            ))}
            {[
              "Custom domain (coming soon)",
              "CRM integrations",
              "Lead capture forms"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40">
                <X className="w-5 h-5 text-neutral-400 shrink-0" />
                <span className="text-neutral-400">{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 rounded-xl font-bold text-lg bg-rose-50 text-rose-600 hover:bg-indigo-100 transition-colors">
            Get Started Free
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-neutral-950 text-white border border-neutral-800 rounded-[2rem] p-10 shadow-2xl relative flex flex-col overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-1.5 rounded-b-xl text-xs font-bold uppercase tracking-widest shadow-md">
            Recommended for Professionals
          </div>

          <div className="mb-8 mt-4 relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">TAGIT Pro</h3>
            <p className="text-neutral-400 mb-6">Advanced features for serious networkers.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">$4.99</span>
              <span className="text-neutral-400 font-medium">/month</span>
            </div>
            <p className="text-xs text-indigo-300 mt-2">Billed annually at $59.88</p>
          </div>
          
          <div className="flex-1 space-y-4 mb-10 relative z-10">
            {[
              "Everything in Standard",
              "Unlimited links",
              "Lead capture forms",
              "Advanced analytics & tap locations",
              "Premium themes & custom CSS",
              "Export to CRM (HubSpot, Salesforce)",
              "Custom domain (coming soon)"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-orange-400 shrink-0" />
                <span className="text-neutral-300">{feature}</span>
              </div>
            ))}
          </div>

          <button className="relative z-10 w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg hover:shadow-rose-500/25 transition-all hover:-translate-y-0.5">
            Upgrade to Pro
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-24 text-center"
      >
        <p className="text-neutral-400 text-lg mb-4">Don't have a physical card yet?</p>
        <a href="/products" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:text-rose-600 transition-colors">
          Browse our premium cards starting at $29 <span aria-hidden="true">&rarr;</span>
        </a>
      </motion.div>
    </main>
  );
}

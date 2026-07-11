"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap, Shield, SmartphoneNfc, Loader2 } from "lucide-react";
import Image from "next/image";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const products = [
  {
    name: "Essential PVC",
    price: "$29",
    description: "Our most popular NFC business card. Durable, sleek, and perfect for everyday networking.",
    features: ["Matte black finish", "Water resistant", "Unlimited taps", "No monthly fees"],
    color: "from-neutral-800 to-neutral-950",
    popular: false,
  },
  {
    name: "Executive Metal",
    price: "$79",
    description: "Make a lasting impression with our premium stainless steel card. Built for executives.",
    features: ["Laser-engraved steel", "Hefty 22g weight", "Premium unboxing", "Priority support"],
    color: "from-neutral-900 to-black",
    popular: true,
  },
  {
    name: "Custom Bamboo",
    price: "$39",
    description: "Eco-friendly and unique. Each bamboo card has a unique wood grain pattern.",
    features: ["100% sustainable", "Laser engraved", "Lightweight", "Conversation starter"],
    color: "from-amber-700 to-stone-800",
    popular: false,
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  const handleCustomizeClick = (productName: string) => {
    setLoadingProduct(productName);
    setTimeout(() => {
      router.push("/customize");
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {loadingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-tr from-rose-500 to-orange-500 p-[2px] shadow-2xl shadow-rose-500/40"
            >
              <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
                <SmartphoneNfc className="text-rose-500 w-12 h-12" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-2"
            >
              Preparing Studio
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-neutral-500 font-medium"
            >
              Loading your {loadingProduct} card...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-950 mb-6">
            Cards designed to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">impress.</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg text-neutral-500">
            Choose the TAGIT card that fits your style. Every card includes our powerful digital profile software for free, forever.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className={`relative bg-white rounded-[2rem] p-8 border ${product.popular ? 'border-rose-500 shadow-2xl shadow-rose-100' : 'border-neutral-200 shadow-lg shadow-neutral-200'} flex flex-col`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Best Seller
                </div>
              )}

              {/* 3D Card Representation */}
              <div className="w-full aspect-[1.58] mb-8 rounded-xl bg-gradient-to-br shadow-2xl overflow-hidden relative group perspective-1000">
                <motion.div
                  className={`w-full h-full bg-gradient-to-br ${product.color} p-6 flex flex-col justify-between`}
                  whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="flex justify-end">
                    <SmartphoneNfc className="text-white/50 w-8 h-8" />
                  </div>
                </motion.div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-950 mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-neutral-950">{product.price}</span>
                  <span className="text-neutral-400">one-time</span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="text-neutral-600 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCustomizeClick(product.name)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all text-center flex items-center justify-center gap-2 ${product.popular ? 'bg-neutral-950 text-white hover:bg-neutral-900 hover:shadow-lg' : 'bg-neutral-100 text-neutral-950 hover:bg-slate-200'}`}
              >
                Customize & Order
              </button>
            </motion.div>
          ))}
        </div>

        {/* Specs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-neutral-950 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" />

          <h2 className="text-3xl md:text-4xl font-bold mb-16 relative z-10">Every TAGIT card comes with</h2>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            <div>
              <Zap className="w-12 h-12 text-orange-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">NXP NTAG215 Chip</h3>
              <p className="text-neutral-400">Industry-leading NFC chips that scan instantly on all modern iOS and Android devices without any apps.</p>
            </div>
            <div>
              <Shield className="w-12 h-12 text-rose-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">Bank-grade Security</h3>
              <p className="text-neutral-400">Your data is yours. Our platform uses end-to-end encryption to keep your digital profile safe.</p>
            </div>
            <div>
              <SmartphoneNfc className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">Dynamic Linking</h3>
              <p className="text-neutral-400">Change your destination link anytime from the dashboard. Your physical card stays exactly the same.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}

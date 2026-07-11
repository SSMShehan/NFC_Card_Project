"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart();
  const { isLight } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`fixed top-0 right-0 h-full z-[70] w-full max-w-md flex flex-col shadow-2xl ${
              isLight
                ? "bg-white border-l border-neutral-200"
                : "bg-[#0e0d14] border-l border-white/10"
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${
              isLight ? "border-neutral-100" : "border-white/10"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md shadow-rose-500/25">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isLight ? "text-neutral-950" : "text-white"}`}>
                    Your Cart
                  </h2>
                  <p className="text-xs text-neutral-400">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-neutral-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight ? "hover:bg-neutral-100 text-neutral-500" : "hover:bg-white/10 text-neutral-400"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-4"
                  >
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                      isLight ? "bg-neutral-100" : "bg-white/5"
                    }`}>
                      <ShoppingBag className="w-10 h-10 text-neutral-300" />
                    </div>
                    <div className="text-center">
                      <p className={`font-semibold ${isLight ? "text-neutral-700" : "text-neutral-300"}`}>
                        Your cart is empty
                      </p>
                      <p className="text-neutral-400 text-sm mt-1">Add a plan or card to get started</p>
                    </div>
                    <Link
                      href="/pricing"
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all"
                    >
                      Browse Plans
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className={`rounded-2xl p-4 border transition-all ${
                        isLight
                          ? "bg-neutral-50 border-neutral-200"
                          : "bg-white/[0.05] border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Item Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === "plan"
                            ? "bg-gradient-to-br from-rose-500/20 to-orange-500/20"
                            : "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                        }`}>
                          {item.type === "plan" ? (
                            <Tag className="w-5 h-5 text-rose-500" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-bold text-sm ${isLight ? "text-neutral-950" : "text-white"}`}>
                              {item.name}
                            </h4>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-wider border border-rose-500/20">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-0.5 ${isLight ? "text-neutral-500" : "text-neutral-400"}`}>
                            {item.price}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className={`flex items-center gap-1 rounded-xl border p-1 ${
                          isLight ? "border-neutral-200 bg-white" : "border-white/15 bg-white/5"
                        }`}>
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              isLight ? "hover:bg-neutral-100 text-neutral-600" : "hover:bg-white/10 text-neutral-300"
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={`w-8 text-center text-sm font-bold ${
                            isLight ? "text-neutral-950" : "text-white"
                          }`}>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              isLight ? "hover:bg-neutral-100 text-neutral-600" : "hover:bg-white/10 text-neutral-300"
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-rose-500">
                          LKR {(item.priceNum * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer — Checkout */}
            {items.length > 0 && (
              <div className={`px-6 py-5 border-t ${
                isLight ? "border-neutral-100 bg-white" : "border-white/10 bg-[#0e0d14]"
              }`}>
                {/* Subtotal */}
                <div className={`flex items-center justify-between mb-2 text-sm ${
                  isLight ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span className={`font-bold ${isLight ? "text-neutral-950" : "text-white"}`}>
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className={`flex items-center justify-between mb-5 text-xs ${
                  isLight ? "text-neutral-400" : "text-neutral-500"
                }`}>
                  <span>Shipping calculated at checkout</span>
                </div>

                <button 
                  onClick={() => {
                    closeCart();
                    if (items.length > 0) {
                      window.location.href = `/order?id=${items[0].id}`;
                    }
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-neutral-400 mt-3">
                  🔒 Secure checkout · 30-day returns
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

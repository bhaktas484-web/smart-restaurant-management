"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is this a food delivery app like Swiggy or Zomato?",
    a: "No. Plateful is internal operating software for the restaurant itself — table, kitchen, inventory, and staff management. It doesn't handle third-party delivery logistics.",
  },
  {
    q: "Do customers need to download an app?",
    a: "No. Customers scan a QR code at their table and order from a browser-based menu — no install required.",
  },
  {
    q: "How does the AI demand forecasting work?",
    a: "It looks at your historical order data, time of day, and day of week to predict busy periods, likely low-stock items, and staffing needs — surfaced as plain-language insights on your dashboard.",
  },
  {
    q: "Can I use this with just one counter, no dine-in tables?",
    a: "Yes — the Single Table plan is built for exactly that: cloud kitchens, food trucks, and counter-service setups.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your sales, inventory, and customer data as CSV or PDF at any time, including after cancellation, for 90 days.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-12 divide-y divide-charcoal/10">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-medium text-charcoal">{item.q}</span>
                  <Plus
                    size={20}
                    className={cn("shrink-0 text-primary transition-transform duration-300", isOpen && "rotate-45")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-slate">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
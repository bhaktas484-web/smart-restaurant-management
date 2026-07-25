"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "We used to run orders on a notepad and shout them to the kitchen. Now the chef sees it before the waiter's even back at the counter.",
    name: "Rhea Kapoor",
    role: "Owner, Copper Leaf Kitchen",
  },
  {
    quote:
      "The low-stock alert caught us before we ran out of paneer on a Saturday night. That alone paid for the year.",
    name: "Aditya Menon",
    role: "Manager, Spice Route Diner",
  },
  {
    quote:
      "Table turnover is the one number I never used to track. Now I see it every morning, and I've actually changed how we seat people.",
    name: "Farah Sheikh",
    role: "Founder, Bistro 24",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow">Restaurants on Plateful</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            Run by people who used to run on chaos
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="flex h-full flex-col">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal">"{t.quote}"</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                  <p className="text-xs text-slate">{t.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
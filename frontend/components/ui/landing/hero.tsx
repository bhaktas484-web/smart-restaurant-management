"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderJourneyRail } from "./order-journey-rail";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-glow-radial pb-24 pt-40">
      <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow"
          >
            AI restaurant operating system
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.05] text-charcoal sm:text-6xl"
          >
            Every table, order, and dish —
            <span className="bg-sunset-gradient bg-clip-text text-transparent"> running itself.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-slate"
          >
            Plateful replaces the notebook, the walkie-talkie, and the six disconnected apps with
            one dashboard — table to kitchen to bill, with AI predicting your next busy hour before
            it hits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href="/register">
              <Button size="lg" className="group">
                Start free trial
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="secondary">
                See it in action
              </Button>
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate"
          >
            {["No card required", "Setup in under 10 minutes", "Works on any device"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: signature live order-journey rail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <OrderJourneyRail />
        </motion.div>
      </div>
    </section>
  );
}
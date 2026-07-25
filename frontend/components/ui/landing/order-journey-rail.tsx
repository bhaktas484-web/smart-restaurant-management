"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const STAGES = [
  { key: "RECEIVED", label: "Order received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "COOKING", label: "Cooking" },
  { key: "READY", label: "Ready" },
  { key: "SERVED", label: "Served" },
] as const;

const SAMPLE_TICKET = {
  table: "Table 7",
  items: ["Margherita Pizza x1", "Cold Brew x2"],
};

/**
 * This is the hero's one bold, deliberate risk: instead of a static
 * "dashboard screenshot" mockup, it plays out the exact 5-stage order
 * lifecycle the product tracks in real time (RECEIVED -> ... -> SERVED),
 * looping every ~7s. It's the single most characteristic thing this
 * product does, shown as an animation rather than described in a bullet.
 */
export function OrderJourneyRail() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % STAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="glass" className="relative overflow-hidden p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate">Live order</p>
          <p className="font-display text-xl font-semibold text-charcoal">{SAMPLE_TICKET.table}</p>
        </div>
        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          {STAGES[activeIndex].label}
        </motion.span>
      </div>

      <ul className="mt-4 space-y-1 text-sm text-slate">
        {SAMPLE_TICKET.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* The rail itself */}
      <div className="mt-8">
        <div className="relative h-1.5 rounded-full bg-charcoal/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-sunset-gradient"
            animate={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {STAGES.map((stage, i) => (
            <div key={stage.key} className="flex flex-col items-center gap-1.5" style={{ width: 44 }}>
              <motion.div
                animate={{
                  scale: i === activeIndex ? 1.3 : 1,
                  backgroundColor: i <= activeIndex ? "#FF5A1F" : "#E5E4E8",
                }}
                transition={{ duration: 0.4 }}
                className="h-2.5 w-2.5 rounded-full"
              />
              <span
                className={`text-center text-[10px] leading-tight ${
                  i === activeIndex ? "font-semibold text-charcoal" : "text-slate-light"
                }`}
              >
                {stage.label.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-light">
        Synced live to the kitchen display and the customer's phone — no refresh needed.
      </p>
    </Card>
  );
}
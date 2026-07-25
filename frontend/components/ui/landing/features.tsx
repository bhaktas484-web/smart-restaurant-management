"use client";

import { motion } from "framer-motion";
import {
  LayoutGrid,
  ChefHat,
  Package,
  Users,
  Receipt,
  Sparkles,
  QrCode,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Visual table management",
    description: "Drag and drop reservations onto a live floor plan. Know what's free at a glance.",
    span: "md:col-span-2",
  },
  {
    icon: QrCode,
    title: "QR menu ordering",
    description: "Guests scan, browse, customize, and order — no app download.",
    span: "",
  },
  {
    icon: ChefHat,
    title: "Kitchen display system",
    description: "Chefs see incoming tickets, priority flags, and cook timers in one view.",
    span: "",
  },
  {
    icon: Sparkles,
    title: "AI demand forecasting",
    description: "\"Friday 8 PM will be crowded\" — staffing and prep, decided before it happens.",
    span: "md:col-span-2",
  },
  {
    icon: Package,
    title: "Auto-deducting inventory",
    description: "Stock drops the moment an order fires. Low-stock alerts before you run out.",
    span: "",
  },
  {
    icon: Receipt,
    title: "Billing & invoicing",
    description: "Cash, card, or UPI — tax, discounts, and coupons handled automatically.",
    span: "",
  },
  {
    icon: Users,
    title: "Staff scheduling",
    description: "Attendance, shifts, and performance for every chef, waiter, and cashier.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Real business intelligence",
    description: "Sales, peak hours, and top dishes — exportable, not just pretty charts.",
    span: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Everything, connected</span>
          <h2 className="mt-3 text-balance font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            One dashboard. Every part of the floor.
          </h2>
          <p className="mt-4 text-lg text-slate">
            Built for restaurants juggling too many disconnected tools — not another delivery app.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={feature.span}
            >
              <Card className="h-full transition-shadow hover:shadow-soft-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-charcoal">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
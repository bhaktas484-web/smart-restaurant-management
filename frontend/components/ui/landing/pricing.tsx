"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Single Table",
    price: "₹1,499",
    period: "/month",
    description: "For food trucks, cloud kitchens, and single-counter setups.",
    features: ["1 restaurant location", "QR menu + ordering", "Basic reports", "Email support"],
    highlighted: false,
  },
  {
    name: "Full Floor",
    price: "₹4,999",
    period: "/month",
    description: "For dine-in restaurants running the whole operation.",
    features: [
      "Everything in Single Table",
      "Table management + reservations",
      "Kitchen display system",
      "Inventory auto-deduction",
      "AI demand forecasting",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Multi-Location",
    price: "Custom",
    period: "",
    description: "For chains and franchises managing several branches.",
    features: [
      "Everything in Full Floor",
      "Unlimited locations",
      "Centralized CRM & loyalty",
      "Dedicated onboarding",
      "Custom integrations",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            Priced for the size of your floor
          </h2>
          <p className="mt-4 text-lg text-slate">No per-order fees. No commission on your sales.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                variant={plan.highlighted ? "glass" : "solid"}
                className={cn(
                  "flex h-full flex-col",
                  plan.highlighted && "relative border-2 border-primary/30 shadow-glow"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sunset-gradient px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-charcoal">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold text-charcoal">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate">{plan.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-charcoal">
                      <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                  {plan.price === "Custom" ? "Contact sales" : "Start free trial"}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
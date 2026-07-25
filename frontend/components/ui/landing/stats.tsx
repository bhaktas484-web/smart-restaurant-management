"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "18 min", label: "avg. table turnaround saved" },
  { value: "34%", label: "fewer order errors reported" },
  { value: "4.2 hrs", label: "manager admin time saved / week" },
  { value: "99.9%", label: "uptime on live order sync" },
];

export function Stats() {
  return (
    <section className="bg-charcoal-gradient py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-semibold text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
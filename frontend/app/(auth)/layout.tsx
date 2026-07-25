import Link from "next/link";
import { UtensilsCrossed, LayoutGrid, ChefHat, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  { icon: LayoutGrid, text: "Live table & order tracking" },
  { icon: ChefHat, text: "Kitchen display, synced instantly" },
  { icon: Sparkles, text: "AI insights before problems happen" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link href="/" className="mb-10 flex items-center gap-2 font-display text-lg font-semibold text-charcoal">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sunset-gradient text-white">
            <UtensilsCrossed size={18} />
          </span>
          Plateful
        </Link>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>

      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-charcoal-gradient lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-glow-radial opacity-70" />
        <div className="relative">
          <p className="text-sm font-medium text-white/50">Trusted by restaurants across India</p>
          <h2 className="mt-4 max-w-md text-balance font-display text-3xl font-semibold text-white">
            Run your whole floor from one screen.
          </h2>
        </div>

        <div className="relative space-y-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-primary">
                <item.icon size={18} />
              </span>
              <span className="text-sm text-white/80">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
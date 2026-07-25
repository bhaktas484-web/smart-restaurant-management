import Link from "next/link";
import { UtensilsCrossed, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-4 py-4">
      <div className="container overflow-hidden rounded-3xl bg-charcoal-gradient px-8 py-16 text-center sm:px-16">
        <h2 className="text-balance font-display text-4xl font-semibold text-white sm:text-5xl">
          Stop running your restaurant from memory.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Set up your first location in under 10 minutes. No credit card required to start.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg">Start free trial</Button>
          </Link>
          <Link href="#contact">
            <Button size="lg" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              Talk to us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="mt-8 border-t border-charcoal/10 py-12">
      <div className="container grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-charcoal">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sunset-gradient text-white">
              <UtensilsCrossed size={16} />
            </span>
            Plateful
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate">
            The operating system for restaurants that have outgrown the notebook.
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate">
            <p className="flex items-center gap-2">
              <Mail size={14} /> hello@plateful.app
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} /> Kolkata, India
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-charcoal">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate">
            <li><a href="#features" className="hover:text-primary">Features</a></li>
            <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
            <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-charcoal">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
          </ul>
        </div>
      </div>

      <div className="container mt-10 border-t border-charcoal/10 pt-6 text-xs text-slate-light">
        © {new Date().getFullYear()} Plateful. Built for VibeAthon 6.0.
      </div>
    </footer>
  );
}
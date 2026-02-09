"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSearch, Home, Radio } from "lucide-react";
import LoginButton from "@/components/auth/LoginButton";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search Files", icon: FileSearch },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-amber-600/10 bg-[#060606]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex size-8 items-center justify-center">
            <div className="absolute inset-0 bg-amber-600/20 transition-colors group-hover:bg-amber-600/30" />
            <span className="relative text-[10px] font-bold text-amber-500">
              ER
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-200 transition-colors group-hover:text-amber-500">
              EpsteinRAG
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-600">
              Intelligence Search
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-all ${
                  active
                    ? "text-amber-500"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="size-3" />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-amber-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 md:flex">
            <Radio className="size-2.5 animate-pulse text-emerald-500" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">
              44,886 indexed
            </span>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}

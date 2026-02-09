import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AppPreview from "@/components/landing/AppPreview";
import CallToAction from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <AppPreview />
      <CallToAction />
    </main>
  );
}

import { HomeHeader } from "@/components/Home/HomeHeader";
import { HomeFeatures } from "@/components/Home/HomeFeatures";
import { HowItWorks } from "@/components/Home/HowItWorks"
import { Footer } from "@/components/Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <HomeHeader />
      <HomeFeatures />
      <HowItWorks />
      <Footer />
    </div>
  );
}
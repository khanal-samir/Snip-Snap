import Features from "@/components/base/Features";
import Footer from "@/components/base/Footer";
import GetStarted from "@/components/base/GetStarted";
import Header from "@/components/base/Header";
import Hero from "@/components/base/Hero";
import Logos from "@/components/base/Logos";

export default function Home() {
  return (
    <div className="w-full min-h-screen space-y-10">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <GetStarted />
      <Footer />
    </div>
  );
}

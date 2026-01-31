"use client"
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ValueProposition from './components/ValueProposition';
import FeatureCards from './components/FeatureCards';
import HowItWorks from './components/HowItWorks';

import ImpactMetrics from './components/ImpactMetrics';
import Footer from './components/Footer';
export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      
      {/* Global Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />
 {/* How It Works */}
      <HowItWorks />
      {/* Value Proposition */}
      <ValueProposition />

      {/* Feature Cards */}
      <FeatureCards />
      {/* Impact Metrics */}
      <ImpactMetrics />
      {/* Footer */}
      <Footer />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 bg-purple-100 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse-glow" />
      </div>

    </main>
  );
}

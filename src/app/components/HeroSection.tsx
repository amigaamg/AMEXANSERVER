'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{
          backgroundImage: "url('/images/Hero.png')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/70 to-blue-950/90" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[95vh] max-w-7xl flex-col justify-center px-6 md:px-12">
        <div className="max-w-3xl text-left">
          {/* Headline */}
          <h1 className="text-4xl font-extrabold leading-snug tracking-tight text-cream-50 md:text-5xl lg:text-6xl drop-shadow-lg">
            Care that doesn’t end <br className="hidden sm:block" />
            when the visit does.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg font-medium leading-relaxed text-blue-100 md:text-xl drop-shadow-sm">
            Amexan connects patients, clinicians, and health data into a continuous
            care experience — before, during, and long after every consultation.
          </p>

          {/* Supporting Copy */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-200 md:text-lg">
            Healthcare doesn’t happen in moments. It unfolds over time — through
            follow-ups, decisions, medications, and daily lives. Amexan is built to
            support that reality, providing a secure digital platform for ongoing
            care, clinical intelligence, and trusted collaboration.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center rounded-full bg-cream-100 px-8 py-3 text-sm font-semibold text-blue-900 shadow-lg transition-all duration-300 hover:bg-white hover:scale-105"
            >
              Get Started
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-blue-200/40 px-8 py-3 text-sm font-semibold text-blue-100 transition-all duration-300 hover:bg-blue-900/40 hover:text-white hover:scale-105"
            >
              See How It Works
            </Link>
          </div>

          {/* Subtle Trust Cue */}
          <p className="mt-8 text-sm text-blue-300">
            Trusted by patients and clinicians across diverse care settings.
          </p>
        </div>
      </div>
    </section>
  );
}

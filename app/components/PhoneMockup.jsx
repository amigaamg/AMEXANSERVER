"use client";

import React, { useEffect, useState } from "react";
import { Activity, Video, ShoppingBag, MessageCircle, Users, CheckCircle } from "lucide-react";

/**
 * AMEXAN — HERO SECTION
 * Trillion‑dollar UX/UI baseline
 * - Message first
 * - Devices second
 * - Proof third
 * - Calm, powerful, human
 */

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  const community = [
    { id: 1, name: "Dr. Sarah Chen", role: "Doctor", msg: "Virtual consults feel effortless here.", t: "2m", c: "bg-blue-600" },
    { id: 2, name: "Michael R.", role: "Patient", msg: "Prescription delivered in minutes.", t: "5m", c: "bg-violet-600" },
    { id: 3, name: "Dr. James W.", role: "Doctor", msg: "Supply ordering is now one click.", t: "9m", c: "bg-cyan-600" },
    { id: 4, name: "Emma T.", role: "Patient", msg: "Clean, fast, reliable care.", t: "14m", c: "bg-pink-600" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-16 md:py-24 bg-[linear-gradient(135deg,#F6F1EA_0%,#FFFFFF_45%,#E8F4FF_100%)]">
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <header className={`mx-auto mb-20 max-w-3xl text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow">
            <Activity className="h-4 w-4" /> Trusted by healthcare professionals worldwide
          </div>
          <h1 className="mb-6 text-balance text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Healthcare, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Unified</span>.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
            Amexan connects patients, clinicians, and medical commerce into one intelligent global platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary">Start Free</button>
            <button className="btn-secondary"><Video className="h-5 w-5" /> Watch Demo</button>
          </div>
        </header>

        {/* DEVICES */}
        <div className={`grid grid-cols-1 gap-14 lg:grid-cols-3 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* LEFT — iPhone App */}
          <Device label="Care App">
            <Phone>
              <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
                  <div>
                    <p className="font-semibold">Dr. Emily Carter</p>
                    <p className="text-xs text-gray-500">Cardiology • Online</p>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat icon={<Activity />} label="Heart Rate" value="72 bpm" />
                  <Stat icon={<CheckCircle />} label="BP" value="120/80" />
                </div>
                <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">Start Consultation</button>
              </div>
            </Phone>
          </Device>

          {/* CENTER — MacBook Dashboard */}
          <Device label="Professional Dashboard" center>
            <Laptop>
              <div className="h-full bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <div className="flex items-center gap-2 font-bold"><span className="h-6 w-6 rounded bg-gradient-to-br from-blue-600 to-cyan-500" /> Amexan</div>
                  <nav className="hidden gap-6 text-sm text-gray-500 md:flex"><span>Dashboard</span><span>Patients</span><span>Analytics</span></nav>
                </div>
                <div className="grid h-full grid-cols-12">
                  <aside className="col-span-3 hidden border-r p-6 md:block">
                    <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-500" />
                    <p className="text-center font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-center text-xs text-gray-500">Chief Consultant</p>
                  </aside>
                  <main className="col-span-12 p-6 md:col-span-9">
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <Metric v="248" l="Patients" />
                      <Metric v="12" l="Today" />
                      <Metric v="92%" l="Recovery" />
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow">
                      <p className="mb-4 font-semibold">Live Activity</p>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li>New patient checked in</li>
                        <li>Prescription approved</li>
                        <li>Supply order completed</li>
                      </ul>
                    </div>
                  </main>
                </div>
              </div>
            </Laptop>
          </Device>

          {/* RIGHT — Medical Shop */}
          <Device label="Medical Commerce">
            <Phone>
              <div className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold"><ShoppingBag /> Medical Shop</h3>
                <div className="space-y-3">
                  <Product name="Thermometer" price="$29" />
                  <Product name="BP Monitor" price="$79" />
                  <Product name="First Aid Kit" price="$34" />
                </div>
                <button className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white">View All</button>
              </div>
            </Phone>
          </Device>
        </div>

        {/* COMMUNITY */}
        <section className={`mx-auto mt-24 max-w-5xl rounded-3xl bg-white p-8 shadow-xl transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <header className="mb-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-blue-600"><MessageCircle /> <span className="font-bold">Community Live</span></div>
            <p className="text-gray-600">Doctors and patients connecting right now</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {community.map(m => (
              <div key={m.id} className="flex gap-4 rounded-xl bg-gray-50 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-bold ${m.c}`}>{m.name[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {m.name}
                    <span className={`rounded px-2 py-0.5 text-xs ${m.role === "Doctor" ? "bg-blue-100 text-blue-600" : "bg-violet-100 text-violet-600"}`}>{m.role}</span>
                    <span className="ml-auto text-xs text-gray-400">{m.t}</span>
                  </div>
                  <p className="text-sm text-gray-600">{m.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white"><Users /> Join Live Space</button>
        </section>
      </div>

      {/* styles */}
      <style jsx>{`
        .orb{position:absolute;border-radius:9999px;filter:blur(90px);opacity:.25;animation:float 22s ease-in-out infinite}
        .orb-1{width:420px;height:420px;background:#0B66FF;top:-120px;left:-120px}
        .orb-2{width:360px;height:360px;background:#A78BFA;bottom:-120px;right:-120px;animation-delay:6s}
        .orb-3{width:260px;height:260px;background:#06B6D4;top:40%;left:50%;animation-delay:12s}
        @keyframes float{0%,100%{transform:translate(0)}50%{transform:translate(30px,-30px)}}
        .btn-primary{display:flex;align-items:center;gap:.5rem;border-radius:14px;background:#0B66FF;color:#fff;padding:1rem 1.75rem;font-weight:700;box-shadow:0 15px 30px rgba(11,102,255,.35)}
        .btn-primary:hover{transform:translateY(-2px)}
        .btn-secondary{display:flex;align-items:center;gap:.5rem;border-radius:14px;background:#fff;color:#111827;padding:1rem 1.75rem;font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.1)}
      `}</style>
    </section>
  );
}

function Device({ children, label, center }) {
  return (
    <div className={`flex flex-col items-center ${center ? "lg:-mt-10" : ""}`}>
      {children}
      <p className="mt-4 text-sm font-semibold text-gray-500">{label}</p>
    </div>
  );
}

function Phone({ children }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-[320px] rounded-[3rem] bg-gradient-to-b from-slate-900 to-slate-800 p-3 shadow-2xl"
    >
      {/* notch */}
      <div className="absolute left-1/2 top-3 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

      {/* glass screen */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-cyan-500/10" />
        {children}
      </div>

      {/* home indicator */}
      <div className="absolute bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-slate-600" />
    </motion.div>
  );
}

function Laptop({ children }) {
  return (
    <div className="w-full max-w-[620px]">
      <div className="rounded-xl bg-gray-800 p-2 shadow-2xl">
        <div className="overflow-hidden rounded-lg bg-white">{children}</div>
      </div>
      <div className="mx-auto h-2 w-[90%] rounded-b-xl bg-gradient-to-b from-gray-700 to-gray-900" />
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="mb-2 text-blue-600">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function Metric({ v, l }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow">
      <p className="text-2xl font-extrabold text-blue-600">{v}</p>
      <p className="text-xs text-gray-500">{l}</p>
    </div>
  );
}

function Product({ name, price }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
      <span className="font-semibold">{name}</span>
      <span className="font-bold text-blue-600">{price}</span>
    </div>
  );
}

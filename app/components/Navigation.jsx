"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Shield, DollarSign, Video, FileText, ShoppingCart, Building2, Users, Brain, Stethoscope, Hospital, Phone, MessageSquare, Activity, Pill, Heart, HeartPulse, FolderOpen, Image, Share2, Lock, BarChart3, Calendar, CreditCard, FileCheck, Package, Home, Wrench, Globe, BookOpen, GraduationCap, Target, TrendingUp } from 'lucide-react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRefs = useRef({});
  const navRef = useRef(null);

  // Close dropdowns on ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if we're not clicking on the navbar or its dropdowns
      if (activeDropdown && navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Handle body overflow for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Click-first dropdown toggle
  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Mobile menu section toggle
  const handleMobileSectionToggle = (section) => {
    setActiveMobileSection(activeMobileSection === section ? null : section);
  };

  const solutionsMegaMenu = {
    'Virtual Care': [
      { icon: Video, label: 'Video Consultations', href: '/solutions/video' },
      { icon: MessageSquare, label: 'Secure Chat', href: '/solutions/chat' },
      { icon: Activity, label: 'Remote Monitoring', href: '/solutions/monitoring' },
      { icon: Pill, label: 'e-Prescriptions', href: '/solutions/prescriptions' },
      { icon: Heart, label: 'Mental Health', href: '/solutions/mental-health' },
      { icon: HeartPulse, label: 'Chronic Care Programs', href: '/solutions/chronic-care' }
    ],
    'Medical Data': [
      { icon: FileText, label: 'Electronic Medical Records', href: '/solutions/emr' },
      { icon: FolderOpen, label: 'Patient Health Profiles', href: '/solutions/profiles' },
      { icon: Image, label: 'Imaging & Lab Results', href: '/solutions/imaging' },
      { icon: Share2, label: 'Records Exchange', href: '/solutions/exchange' },
      { icon: Lock, label: 'Consent & Access Control', href: '/solutions/consent' }
    ],
    'Infrastructure': [
      { icon: Building2, label: 'Clinic Management', href: '/solutions/clinic' },
      { icon: BarChart3, label: 'Hospital Dashboards', href: '/solutions/dashboards' },
      { icon: Calendar, label: 'Appointment Systems', href: '/solutions/appointments' },
      { icon: CreditCard, label: 'Billing & Insurance', href: '/solutions/billing' },
      { icon: FileCheck, label: 'Audit Logs', href: '/solutions/audit' },
      { icon: Shield, label: 'Compliance Tools', href: '/solutions/compliance' }
    ],
    'Marketplace': [
      { icon: Package, label: 'Medical Supplies', href: '/marketplace/supplies' },
      { icon: Pill, label: 'Pharmaceuticals', href: '/marketplace/pharma' },
      { icon: Home, label: 'Medical Real Estate', href: '/marketplace/real-estate' },
      { icon: Wrench, label: 'Equipment Leasing', href: '/marketplace/equipment' },
      { icon: Users, label: 'Verified Vendors', href: '/marketplace/vendors' }
    ]
  };

  const patientsMenu = [
    { icon: Stethoscope, label: 'Find a Doctor', href: '/patients/find-doctor' },
    { icon: Calendar, label: 'Book Appointments', href: '/patients/book' },
    { icon: Video, label: 'Virtual Visits', href: '/patients/virtual' },
    { icon: Pill, label: 'Prescriptions', href: '/patients/prescriptions' },
    { icon: FileText, label: 'Medical Records', href: '/patients/records' },
    { icon: HeartPulse, label: 'Health Programs', href: '/patients/programs' },
    { icon: DollarSign, label: 'Pricing & Coverage', href: '/patients/pricing' }
  ];

  const doctorsMenu = [
    { icon: BarChart3, label: 'Doctor Dashboard', href: '/doctors/dashboard' },
    { icon: Video, label: 'Telemedicine Tools', href: '/doctors/telemedicine' },
    { icon: Users, label: 'Patient Management', href: '/doctors/patients' },
    { icon: FileText, label: 'Clinical Notes', href: '/doctors/notes' },
    { icon: DollarSign, label: 'Earnings & Payouts', href: '/doctors/earnings' },
    { icon: GraduationCap, label: 'CME Courses', href: '/doctors/cme' },
    { icon: Target, label: 'Join as a Doctor', href: '/doctors/join', highlight: true }
  ];

  const hospitalsMenu = [
    { icon: Hospital, label: 'Hospital Platform', href: '/hospitals/platform' },
    { icon: Share2, label: 'EMR Integration', href: '/hospitals/integration' },
    { icon: Users, label: 'Multi-Doctor Management', href: '/hospitals/management' },
    { icon: BarChart3, label: 'Facility Analytics', href: '/hospitals/analytics' },
    { icon: Globe, label: 'API & Integrations', href: '/hospitals/api' },
    { icon: Building2, label: 'Deployment Options', href: '/hospitals/deployment' },
    { icon: Phone, label: 'Request Enterprise Demo', href: '/hospitals/demo', highlight: true }
  ];

  const marketplaceMenu = [
    { icon: Package, label: 'Medical Supplies', href: '/marketplace/supplies' },
    { icon: Pill, label: 'Pharmaceuticals', href: '/marketplace/pharma' },
    { icon: Activity, label: 'Diagnostics Equipment', href: '/marketplace/diagnostics' },
    { icon: Home, label: 'Medical Real Estate', href: '/marketplace/real-estate' },
    { icon: Building2, label: 'Facility Setup', href: '/marketplace/setup' },
    { icon: Users, label: 'Vendor Registration', href: '/marketplace/vendors' }
  ];

  const communityMenu = [
    { icon: Users, label: 'Doctor Community', href: '/community/doctors' },
    { icon: Heart, label: 'Patient Support Groups', href: '/community/support' },
    { icon: MessageSquare, label: 'Medical Discussions', href: '/community/discussions' },
    { icon: FileText, label: 'Case Studies', href: '/community/cases' },
    { icon: Calendar, label: 'Events & Webinars', href: '/community/events' },
    { icon: TrendingUp, label: 'Research Collaboration', href: '/community/research' }
  ];

  const aiEducationMenu = {
    'AI': [
      { icon: Brain, label: 'AI Doctor Assistant', href: '/ai/assistant' },
      { icon: Activity, label: 'Triage Bots', href: '/ai/triage' },
      { icon: Stethoscope, label: 'Symptom Guidance', href: '/ai/symptoms' },
      { icon: BarChart3, label: 'Clinical Insights', href: '/ai/insights' },
      { icon: Target, label: 'AI Roadmap', href: '/ai/roadmap' }
    ],
    'Education': [
      { icon: BookOpen, label: 'Medical Courses', href: '/education/courses' },
      { icon: Video, label: 'Telemedicine Training', href: '/education/training' },
      { icon: Heart, label: 'Patient Health Education', href: '/education/patient' },
      { icon: GraduationCap, label: 'Certifications', href: '/education/certifications' },
      { icon: FileText, label: 'Knowledge Hub', href: '/education/hub' }
    ]
  };

  const DropdownMenu = ({ items, title }) => (
    <div 
      className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
    >
      {title && (
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
      )}
      <div className="py-2 max-h-[70vh] overflow-y-auto">
        {items.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <a
              key={idx}
              href={item.href}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
              }}
              className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 group ${
                item.highlight 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex-shrink-0">
                {IconComponent && (
                  <IconComponent className={`w-5 h-5 transition-all duration-200 ${
                    item.highlight 
                      ? 'text-blue-600 group-hover:scale-110' 
                      : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'
                  }`} />
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                item.highlight 
                  ? 'text-blue-700' 
                  : 'text-slate-700 group-hover:text-blue-600'
              }`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );

  const MegaMenu = ({ sections }) => (
    <div 
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[95vw] max-w-7xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-slate-100">
        {Object.entries(sections).map(([title, items], sectionIdx) => (
          <div key={title} className={`p-6 ${sectionIdx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'} lg:bg-white hover:bg-slate-50/50 transition-colors`}>
            <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
              {title}
            </h3>
            <div className="space-y-1">
              {items.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      {IconComponent && (
                        <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-125 transition-transform duration-200" />
                      )}
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-blue-600 font-medium transition-colors">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-lg shadow-slate-200/50' 
            : 'bg-white/95 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 shadow-lg">
                  <HeartPulse className="w-4 h-4 lg:w-5 lg:h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl xl:text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent tracking-tight leading-none">
                  AMEXAN
                </span>
                <span className="text-[9px] lg:text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  Healthcare Platform
                </span>
              </div>
            </a>

            {/* Desktop Navigation - CLICK-ONLY, NO HOVER */}
            <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 flex-1 justify-center max-w-5xl px-2">
              
              {/* Solutions Mega Menu */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('solutions')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('solutions')}
                  className="flex items-center gap-1.5 px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'solutions'}
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'solutions' && <MegaMenu sections={solutionsMegaMenu} />}
              </div>

              {/* For Patients */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('patients')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('patients')}
                  className="px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'patients'}
                >
                  For Patients
                </button>
                {activeDropdown === 'patients' && <DropdownMenu items={patientsMenu} title="Patient Portal" />}
              </div>

              {/* For Doctors */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('doctors')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('doctors')}
                  className="px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'doctors'}
                >
                  For Doctors
                </button>
                {activeDropdown === 'doctors' && <DropdownMenu items={doctorsMenu} title="Doctor Hub" />}
              </div>

              {/* For Hospitals */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('hospitals')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('hospitals')}
                  className="px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'hospitals'}
                >
                  Hospitals & Clinics
                </button>
                {activeDropdown === 'hospitals' && <DropdownMenu items={hospitalsMenu} title="Enterprise Solutions" />}
              </div>

              {/* Marketplace */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('marketplace')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('marketplace')}
                  className="px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'marketplace'}
                >
                  Marketplace
                </button>
                {activeDropdown === 'marketplace' && <DropdownMenu items={marketplaceMenu} title="Healthcare Marketplace" />}
              </div>

              {/* Community */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('community')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('community')}
                  className="px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'community'}
                >
                  Community
                </button>
                {activeDropdown === 'community' && <DropdownMenu items={communityMenu} title="Connect & Learn" />}
              </div>

              {/* AI & Education */}
              <div className="relative">
                <button 
                  onClick={() => handleDropdownToggle('ai')}
                  onKeyDown={(e) => e.key === 'Enter' && handleDropdownToggle('ai')}
                  className="flex items-center gap-1.5 px-2 2xl:px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeDropdown === 'ai'}
                >
                  AI & Education
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'ai' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'ai' && <MegaMenu sections={aiEducationMenu} />}
              </div>
            </div>

            {/* Right Actions */}
            <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2.5 flex-shrink-0">
              <a 
                href="/security" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden 2xl:inline">Security</span>
              </a>
              <a 
                href="/pricing" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden 2xl:inline">Pricing</span>
              </a>
              <a 
                href="/login" 
                className="px-4 py-2 text-sm font-bold text-slate-700 border-2 border-slate-300 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Login
              </a>
              <a 
                href="/get-started" 
                className="relative group px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </a>
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Drawer */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 xl:hidden overflow-y-auto animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="p-4 pb-32 space-y-1">
              
              {/* Solutions */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('solutions')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'solutions'}
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'solutions' && (
                  <div className="pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {Object.entries(solutionsMegaMenu).map(([title, items]) => (
                      <div key={title} className="bg-slate-50 rounded-xl p-3">
                        <h3 className="font-bold text-xs text-slate-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                          {title}
                        </h3>
                        <div className="space-y-1">
                          {items.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <a 
                                key={idx} 
                                href={item.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              >
                                {IconComponent && (
                                  <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* For Patients */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('patients')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'patients'}
                >
                  <span>For Patients</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'patients' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'patients' && (
                  <div className="pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {patientsMenu.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a 
                          key={idx} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* For Doctors */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('doctors')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'doctors'}
                >
                  <span>For Doctors</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'doctors' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'doctors' && (
                  <div className="pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {doctorsMenu.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a 
                          key={idx} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            item.highlight ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'
                          }`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className={`text-sm font-medium ${item.highlight ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* For Hospitals & Clinics */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('hospitals')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'hospitals'}
                >
                  <span>Hospitals & Clinics</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'hospitals' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'hospitals' && (
                  <div className="pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {hospitalsMenu.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a 
                          key={idx} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            item.highlight ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'
                          }`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className={`text-sm font-medium ${item.highlight ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Marketplace */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('marketplace')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'marketplace'}
                >
                  <span>Marketplace</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'marketplace' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'marketplace' && (
                  <div className="pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {marketplaceMenu.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a 
                          key={idx} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Community */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('community')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'community'}
                >
                  <span>Community</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'community' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'community' && (
                  <div className="pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {communityMenu.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a 
                          key={idx} 
                          href={item.href} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* AI & Education */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => handleMobileSectionToggle('ai')}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 py-3 px-3 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-expanded={activeMobileSection === 'ai'}
                >
                  <span>AI & Education</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeMobileSection === 'ai' ? 'rotate-180' : ''}`} />
                </button>
                {activeMobileSection === 'ai' && (
                  <div className="pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {Object.entries(aiEducationMenu).map(([title, items]) => (
                      <div key={title} className="bg-slate-50 rounded-xl p-3">
                        <h3 className="font-bold text-xs text-slate-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                          {title}
                        </h3>
                        <div className="space-y-1">
                          {items.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <a 
                                key={idx} 
                                href={item.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              >
                                {IconComponent && (
                                  <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4"></div>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <a 
                  href="/security" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-3 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <Shield className="w-4 h-4 text-blue-600" />
                  Security
                </a>
                <a 
                  href="/pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-3 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Pricing
                </a>
              </div>
            </div>

            {/* Fixed Bottom CTAs */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 xl:hidden space-y-2 shadow-2xl">
              <a 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-bold text-slate-700 border-2 border-slate-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Login
              </a>
              <a 
                href="/get-started" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Get Started
              </a>
            </div>
          </div>
        </>
      )}

      {/* Page Content Spacer */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}
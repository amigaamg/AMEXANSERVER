import React, { useState } from 'react';
import { Users, Activity, Heart, FileText, Video, Calendar, MessageCircle, Shield, Lock, Globe, CheckCircle, Building } from 'lucide-react';

const DeviceMockupsFooter = () => {
  return (
    <div className="relative" style={{ height: '450px' }}>
      {/* Center Phone with Doctor */}
      <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] z-30 animate-float" style={{ animationDelay: '0.5s', animationDuration: '3.8s' }}>
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden">
            <div className="bg-gray-900 h-6 flex items-center justify-center">
              <div className="w-24 h-4 bg-black rounded-full"></div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg mb-3">
                <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl mb-3 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <h4 className="font-bold text-sm mb-1">Dr. Emily Carter</h4>
                  <p className="text-xs text-gray-600">Cardiologist</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Available Now</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700 transition-colors mb-2">
                  Start Consultation
                </button>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1">
                    <Video className="w-3 h-3" />
                    Video
                  </button>
                  <button className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Laptop */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[450px] z-10 animate-float" style={{ animationDuration: '4.2s' }}>
        <div className="bg-gray-800 rounded-t-2xl p-2 shadow-2xl">
          <div className="bg-white rounded-t-lg overflow-hidden">
            <div className="bg-gradient-to-br from-white to-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <span className="text-xs font-bold text-gray-700">Operations Dashboard</span>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                  New Appointment
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                <div className="text-sm font-bold text-gray-800 mb-3">Today's Schedule</div>
                
                <div className="space-y-2 mb-3">
                  {[
                    { time: '9:00 AM', name: 'Michael Chen', type: 'Follow-up' },
                    { time: '10:30 AM', name: 'Sarah Johnson', type: 'Consultation' },
                    { time: '2:00 PM', name: 'Robert Kim', type: 'Procedure' }
                  ].map((appointment, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{appointment.time}</div>
                          <div className="text-xs text-gray-600">{appointment.name}</div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 h-4 rounded-b-2xl"></div>
      </div>

      {/* Right Tablet */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[380px] z-20 animate-float" style={{ animationDelay: '0.8s', animationDuration: '3.5s' }}>
        <div className="bg-gray-800 rounded-3xl p-3 shadow-2xl">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800">My Health Records</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="w-full h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mb-2 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700">Medical History</div>
                  <div className="text-xs text-gray-500">Updated yesterday</div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Prescriptions', count: 3 },
                    { name: 'Lab Results', count: 5 },
                    { name: 'Vaccinations', count: 'Up to date' }
                  ].map((item, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-2 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-700">{item.name}</div>
                        <div className="text-xs text-blue-600 font-semibold">{item.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small Right Phone */}
      <div className="absolute right-16 bottom-4 w-[160px] z-25 animate-float" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
        <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[1.5rem] overflow-hidden">
            <div className="bg-gradient-to-br from-white to-blue-50 p-3">
              <div className="text-xs font-bold mb-2 text-gray-800">Upcoming Appointments</div>
              
              <div className="space-y-2">
                {[
                  { time: '10 AM', doctor: 'Dr. Patel' },
                  { time: '2 PM', doctor: 'Dr. Miller' },
                  { time: '4 PM', doctor: 'Lab Work' }
                ].map((appointment, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-[9px] font-semibold text-gray-700">{appointment.time}</div>
                        <div className="text-[8px] text-gray-600">{appointment.doctor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-blue-600 text-white rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-700 transition-colors mt-2">
                Schedule New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [activeTab, setActiveTab] = useState('patients');

  const tabContent = {
    patients: {
      title: "Care Without Friction",
      subtitle: "Your entire healthcare journey, simplified and connected in one place.",
      features: [
        {
          icon: Users,
          title: "Find & Book Trusted Doctors",
          description: "Search and book appointments with verified healthcare providers in minutes.",
          color: "blue"
        },
        {
          icon: MessageCircle,
          title: "Secure Messaging with Your Care Team",
          description: "24/7 access to your doctors with encrypted messaging for follow-ups and questions.",
          color: "green"
        },
        {
          icon: Activity,
          title: "Health Monitoring & Insights",
          description: "Track vital signs, medications, and receive personalized health recommendations.",
          color: "purple"
        },
        {
          icon: FileText,
          title: "Unified Health Records",
          description: "All your medical history, test results, and prescriptions in one secure location.",
          color: "cyan"
        }
      ],
      cta: "Start Your Healthcare Journey"
    },
    doctors: {
      title: "Practice Without Burnout",
      subtitle: "Focus on patient care while we handle the administrative complexity.",
      features: [
        {
          icon: Calendar,
          title: "Smart Scheduling & Calendar",
          description: "Automated appointment management with intelligent time optimization.",
          color: "blue"
        },
        {
          icon: Video,
          title: "Integrated Virtual Consultations",
          description: "Seamless video visits with built-in patient records and billing.",
          color: "green"
        },
        {
          icon: FileText,
          title: "Automated Documentation",
          description: "AI-assisted charting and note-taking to reduce administrative load.",
          color: "purple"
        },
        {
          icon: Activity,
          title: "Patient Monitoring Dashboard",
          description: "Real-time tracking of patient progress and automated follow-up reminders.",
          color: "cyan"
        }
      ],
      cta: "Join Our Network"
    },
    organizations: {
      title: "Operate Healthcare at Scale",
      subtitle: "Enterprise-grade tools for hospitals, clinics, and healthcare systems.",
      features: [
        {
          icon: Building,
          title: "Multi-Location Management",
          description: "Centralized control across all facilities with unified patient data.",
          color: "blue"
        },
        {
          icon: Users,
          title: "Staff Coordination & Workflows",
          description: "Optimized team scheduling, task assignment, and communication protocols.",
          color: "green"
        },
        {
          icon: Activity,
          title: "Real-Time Analytics & Reporting",
          description: "Compliance reports, operational metrics, and performance dashboards.",
          color: "purple"
        },
        {
          icon: Shield,
          title: "Enterprise Security & Compliance",
          description: "HIPAA-ready infrastructure with audit trails and data governance tools.",
          color: "cyan"
        }
      ],
      cta: "Schedule Enterprise Demo"
    }
  };

  const currentContent = tabContent[activeTab];

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-violet-50 py-20 overflow-hidden">
      {/* Background Elements - Subtle orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-violet-100 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-cyan-100 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Title Section - Fixed */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Healthcare That Works for Everyone, Everywhere
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From first consultation to follow-up care — all in one trusted platform.
          </p>
        </div>

        {/* Tab Navigation - Refined */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {[
            { id: 'patients', label: 'For Patients', icon: Heart },
            { id: 'doctors', label: 'For Doctors', icon: Activity },
            { id: 'organizations', label: 'For Organizations', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm scale-[1.02]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Card - Fixed content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl mb-20 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentContent.title}
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {currentContent.subtitle}
              </p>
              
              <div className="space-y-6">
                {currentContent.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 group hover:bg-blue-50/50 p-3 rounded-xl transition-all duration-200">
                      <div className={`p-3 rounded-xl bg-${feature.color}-50 group-hover:bg-${feature.color}-100 transition-colors`}>
                        <Icon className={`w-5 h-5 text-${feature.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                {currentContent.cta}
              </button>
            </div>
            
            <div className="relative">
              <DeviceMockupsFooter />
            </div>
          </div>
        </div>

        {/* NEW: Trust & Closing Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Trust Signals */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Trust & Security</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">HIPAA & GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Clinician-Led Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm text-gray-600">Global Healthcare Standards</span>
                </div>
              </div>
            </div>

            {/* Secondary Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="grid grid-cols-2 gap-3">
                {['About Us', 'Careers', 'Contact', 'Blog', 'Press', 'Research'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal & Support</h4>
              <div className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Trust Center', 'Support Center', 'Status'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors block"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Anchor */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">Amexan</span>
              </div>
              <p className="text-sm text-gray-500 max-w-md">
                Building a world where healthcare is accessible, efficient, and human-centered.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Amexan Health Technologies. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Footer;
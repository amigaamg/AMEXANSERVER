'use client';

import { Heart, Brain, Shield, Zap, Clock, Users, BarChart, Cloud, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import Button from './shared/Button';

const ValueProposition = () => {
  const coreFeatures = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Chronic Care",
      description: "Monitor your conditions, predict trends, and receive proactive alerts to prevent complications before they arise.",
      highlight: "Predictive monitoring"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Advanced AI analyzes symptoms and health data to provide preliminary insights before doctor consultations.",
      highlight: "Smart diagnostics"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trusted Security",
      description: "Your health data is fully encrypted using hospital-level protocols, ensuring privacy, safety, and compliance.",
      highlight: "HIPAA compliant"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Care Access",
      description: "Connect with certified physicians worldwide in under 5 minutes, anytime, anywhere.",
      highlight: "24/7 availability"
    },
  ];

  const smartFeatures = [
    { icon: <Clock className="w-5 h-5" />, text: "Real-time Monitoring" },
    { icon: <Users className="w-5 h-5" />, text: "Family Health Tracking" },
    { icon: <BarChart className="w-5 h-5" />, text: "Predictive Analytics" },
    { icon: <Cloud className="w-5 h-5" />, text: "Cloud-Based Records" },
  ];

  const healthMetrics = [
    { label: 'Medication Adherence', value: 98, color: 'bg-blue-500' },
    { label: 'Appointment Attendance', value: 100, color: 'bg-blue-400' },
    { label: 'Condition Monitoring', value: 92, color: 'bg-blue-300' },
  ];

  return (
    <section className="section-padding relative bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      </div>

      <div className="container-wrapper relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 left-1/4 w-6 h-6 rounded-full bg-blue-400 opacity-70"></div>
          <div className="absolute top-10 right-1/4 w-4 h-4 rounded-full bg-blue-300 opacity-60"></div>
          
          {/* Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 px-6 py-3 rounded-full mb-8 border border-blue-200 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm font-semibold tracking-wide">THE AMEXAN DIFFERENCE</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Choose</span> Amexan?
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            More than healthcare — Amexan is your smart health partner. Seamlessly connecting patients, 
            doctors, labs, and pharmacies into one intelligent ecosystem for safer, smarter living.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {coreFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100/50 hover:border-blue-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-100/0 to-blue-300/0 rounded-2xl group-hover:from-blue-500/5 group-hover:via-blue-100/10 group-hover:to-blue-300/5 transition-all duration-500"></div>
              
              {/* Animated icon container */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
                  {feature.icon}
                </div>
                {/* Decorative dot */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlight badge */}
                <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full border border-blue-100 group-hover:bg-blue-100 transition-colors">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                  {feature.highlight}
                </div>
              </div>
              
              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>
          ))}
        </div>

        {/* Integrated Platform Showcase */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100/50 mb-16 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 px-5 py-2.5 rounded-full mb-8 border border-blue-200 backdrop-blur-sm">
                <span className="text-sm font-semibold tracking-wide">INTEGRATED PLATFORM</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Real-Time</span> Health Decisions
              </h3>
              
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                Gain a complete view of your health — medications, labs, doctor notes, and lifestyle insights — 
                all in one place. Amexan synthesizes this into actionable guidance to keep you proactive.
              </p>
              
              {/* Smart Features Grid */}
              <div className="grid grid-cols-2 gap-5 mb-12">
                {smartFeatures.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 group hover:shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-4 transform group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <div className="text-blue-600">{item.icon}</div>
                    </div>
                    <span className="font-semibold text-gray-800">{item.text}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <Button
                href="/features"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                icon={<ArrowRight className="ml-2 w-5 h-5" />}
              >
                Explore All Features
              </Button>
            </div>
            
            {/* Right Column - Health Dashboard Visualization */}
            <div className="relative">
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg transform rotate-3 z-10">
                <span className="font-bold text-sm">Trending Up ↑</span>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-2xl border border-blue-100 max-w-[220px] animate-float-slow z-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">All Systems Go</div>
                    <div className="text-xs text-gray-500">Last checked: Just now</div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Card */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-xl border border-blue-100/50 backdrop-blur-sm relative">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <div className="text-sm text-blue-600 font-medium mb-2">Your Health Score</div>
                    <div className="text-5xl font-bold text-gray-900">94%</div>
                  </div>
                  <div className="relative w-28 h-28">
                    {/* Circular Progress */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#dbeafe" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="url(#health-gradient)" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        style={{ strokeDashoffset: 283 * 0.06 }}
                        className="animate-progress-grow"
                      />
                      <defs>
                        <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl font-bold text-blue-700">A+</div>
                    </div>
                  </div>
                </div>
                
                {/* Health Metrics */}
                <div className="space-y-6 mb-8">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className="text-sm font-bold text-blue-700">{metric.value}%</span>
                      </div>
                      <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-3 rounded-full ${metric.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${metric.value}%` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-100">
                  {[
                    { value: "2", label: "Active Plans" },
                    { value: "7", label: "Days Active" },
                    { value: "100%", label: "On Track" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
                      <div className="text-xl font-bold text-blue-800">{stat.value}</div>
                      <div className="text-xs text-blue-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Numbers Section */}
        <div className="text-center relative">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
              Trusted by Healthcare Professionals & Patients Nationwide
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              {[
                { value: "10K+", label: "Medical Providers" },
                { value: "100K+", label: "Active Patients" },
                { value: "500K+", label: "Health Decisions" },
                { value: "99.9%", label: "Platform Uptime" },
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-b from-white to-blue-50/50 p-6 rounded-2xl border border-blue-100 hover:border-blue-300 transition-colors">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed bg-gradient-to-r from-blue-50/50 to-transparent p-6 rounded-2xl border border-blue-100/50">
              Amexan is more than technology — it's a partnership in health. 
              We're committed to providing tools that empower both patients and providers 
              to achieve better outcomes together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
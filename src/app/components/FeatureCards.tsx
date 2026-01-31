'use client';

import IconCard from './Shared/IconCard';
import { Pill, Stethoscope, Truck, FlaskRound, Activity, Video, Bell, FileText, Sparkles, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';
import Button from './Shared/Button';

const FeatureCards = () => {
  const features = [
    {
      icon: <Activity className="w-10 h-10" />,
      title: "Monitor Your Health",
      description: "Dynamic dashboards, predictive analytics, and personalized health scores empower you to make informed wellness decisions every day.",
      gradient: 'from-blue-500 to-blue-600' as const,
      highlight: "Real-time insights",
      stats: "50+ metrics tracked"
    },
    {
      icon: <Video className="w-10 h-10" />,
      title: "Instant Doctor Access",
      description: "Connect securely with certified physicians anytime via video, chat, or voice. Expert care within minutes, 24/7.",
      gradient: 'from-sky-500 to-cyan-500' as const,
      highlight: "5-minute response",
      stats: "500+ doctors available"
    },
    {
      icon: <Pill className="w-10 h-10" />,
      title: "Smart Medication Tracking",
      description: "Never miss a dose. Intelligent reminders, side-effect logging, and automatic prescription refills keep your regimen effortless.",
      gradient: 'from-indigo-500 to-purple-500' as const,
      highlight: "98% adherence rate",
      stats: "Auto-refill enabled"
    },
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Medical Supplies Delivered",
      description: "Get essential medications, test kits, and medical equipment delivered to your doorstep, swiftly and reliably.",
      gradient: 'from-blue-500 to-teal-500' as const,
      highlight: "Same-day delivery",
      stats: "100+ cities covered"
    },
    {
      icon: <FlaskRound className="w-10 h-10" />,
      title: "Labs & Diagnostics",
      description: "Schedule at-home lab tests, access rapid digital results, and track your health trends over time effortlessly.",
      gradient: 'from-blue-600 to-sky-500' as const,
      highlight: "Digital results in 24h",
      stats: "200+ test types"
    },
  ];

  const secondaryFeatures = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Proactive Alerts",
      description: "Receive timely notifications about potential health risks before they escalate.",
      stat: "2hr early warning",
      color: "bg-blue-500"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Digital Health Records",
      description: "All your medical history securely stored, instantly accessible anytime.",
      stat: "HIPAA compliant",
      color: "bg-sky-500"
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Specialist Network",
      description: "Direct access to 100+ medical specialists across every field, whenever you need expert advice.",
      stat: "24/7 access",
      color: "bg-indigo-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Security",
      description: "Bank-level encryption and privacy controls to keep your health data completely secure.",
      stat: "256-bit encryption",
      color: "bg-blue-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Integration",
      description: "Seamlessly connect with your existing health devices and apps for unified tracking.",
      stat: "30+ integrations",
      color: "bg-cyan-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Advanced algorithms analyze your data to provide personalized health recommendations.",
      stat: "95% accuracy",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container-wrapper relative">
        {/* Section header with decorative elements */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          {/* Decorative badges */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-sky-500/10 text-blue-700 px-4 py-2 rounded-full border border-blue-200 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">ALL-IN-ONE PLATFORM</span>
            </div>
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600/10 to-indigo-500/10 text-blue-700 px-4 py-2 rounded-full border border-blue-200 backdrop-blur-sm">
              <span className="text-sm font-semibold">TRUSTED BY 100K+ USERS</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Health Ecosystem</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From prevention to treatment and long-term wellness, Amexan integrates every aspect of your care into one intelligent, seamless platform.
          </p>
        </div>

        {/* Main features grid with enhanced cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100/50 hover:border-blue-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})` }}
              ></div>
              
              {/* Icon container */}
              <div className="relative mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                {/* Floating stat badge */}
                <div className="absolute -top-2 -right-2 bg-white text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                  {feature.stats}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-blue-50 transition-colors">
                  {feature.description}
                </p>
                
                {/* Highlight badge */}
                <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-100 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  {feature.highlight}
                </div>
              </div>
              
              {/* Animated border */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center group-hover:text-white"></div>
            </div>
          ))}
        </div>

        {/* Enhanced secondary features section */}
        <div className="relative mb-16">
          {/* Main container with gradient border */}
          <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-3xl overflow-hidden border border-blue-100/50">
            {/* Inner gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-sky-500/5 pointer-events-none"></div>
            
            <div className="relative p-8 md:p-12">
              {/* Section header */}
              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                <div>
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 px-5 py-2.5 rounded-full mb-6 border border-blue-200 backdrop-blur-sm">
                    <span className="text-sm font-semibold tracking-wide">ADVANCED FEATURES</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Beyond Basic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Healthcare</span>
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    We innovate continuously to deliver a healthcare platform that anticipates your needs, guides your decisions, and supports your journey at every step.
                  </p>

                  {/* Stats highlight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                      <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">50+</div>
                      <div className="text-sm text-gray-600 font-medium">Health Metrics</div>
                    </div>
                    <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-5 border border-blue-100">
                      <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">24/7</div>
                      <div className="text-sm text-gray-600 font-medium">Support Available</div>
                    </div>
                  </div>
                </div>

                {/* Feature highlight with animation */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mr-4">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Intelligent Health AI</h4>
                        <p className="text-blue-100 text-sm">Powered by machine learning</p>
                      </div>
                    </div>
                    <p className="text-blue-100 mb-6">
                      Our AI analyzes patterns across your health data to provide personalized insights and early warnings.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                          <span>Active & Learning</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">95%</div>
                    </div>
                    <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full w-[95%] animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Floating element */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-2xl border border-blue-100 max-w-[200px] animate-float-slow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">System Optimal</div>
                        <div className="text-xs text-gray-500">Updated just now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary features grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
                {secondaryFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
                  >
                    {/* Colored accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${feature.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={feature.color.replace('bg-', 'text-')}>{feature.icon}</div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">{feature.title}</h4>
                      <p className="text-gray-600 text-xs mb-3">{feature.description}</p>
                      <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {feature.stat}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced CTA */}
              <div className="relative bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 border border-blue-100 overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="relative text-center">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Ready to experience healthcare that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">thinks ahead</span> for you?
                  </h4>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Join thousands of users who trust Amexan with their health journey. Get started in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                      href="/signup"
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      icon={<ArrowRight className="ml-2 w-5 h-5" />}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      href="/demo"
                      variant="outline"
                      size="lg"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Book a Demo
                    </Button>
                  </div>
                  <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card required • 14-day free trial • Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative corner elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500 blur-sm"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-sky-500 blur-sm"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-cyan-500 blur-sm"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-blue-400 blur-sm"></div>
        </div>

        {/* Trust badge */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="w-px h-6 bg-blue-200"></div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">GDPR Ready</span>
            </div>
            <div className="w-px h-6 bg-blue-200"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">100% Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
'use client';

import { useState, useEffect, useRef } from 'react';
import Button from './shared/Button';
import { UserPlus, BarChart3, MessageSquare, CheckCircle, ChevronRight, Sparkles, Shield, Clock, Users } from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const steps = [
    {
      number: "01",
      icon: <UserPlus className="w-6 h-6" />,
      title: "Sign Up & Personalize",
      tagline: "Your journey begins in minutes",
      description: "Create a secure profile and tell us who you are—not just your name, but your health story. Our intelligent system transforms this into a personalized care blueprint.",
      highlights: [
        "Secure, encrypted profile setup",
        "Comprehensive health questionnaire",
        "Personalized care blueprint",
        "Family member profile linking"
      ],
      stat: {
        label: "Setup Time",
        value: "5 min",
        icon: <Clock className="w-4 h-4" />
      }
    },
    {
      number: "02",
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track & Analyze",
      tagline: "From reactive to proactive care",
      description: "Your health is continuously monitored and intelligently analyzed. Advanced analytics detect trends early, helping you move from reactive care to preventive health management.",
      highlights: [
        "Real-time health dashboard",
        "AI-powered trend analysis",
        "Predictive risk assessments",
        "Personalized wellness insights"
      ],
      stat: {
        label: "Early Detection",
        value: "94%",
        icon: <Sparkles className="w-4 h-4" />
      }
    },
    {
      number: "03",
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Consult & Act",
      tagline: "Expert care, instantly available",
      description: "Instantly connect with verified healthcare professionals—no long queues, no uncertainty. Everything flows in one secure platform, with continuous support.",
      highlights: [
        "Instant doctor matching",
        "Secure video consultations",
        "Digital prescriptions",
        "Structured follow-up care"
      ],
      stat: {
        label: "Response Time",
        value: "2 min",
        icon: <Users className="w-4 h-4" />
      }
    }
  ];

  const progressWidth = ((activeStep + 1) / steps.length) * 100;

  return (
    <section 
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="container-wrapper">
        {/* Section Header */}
        <div className={`text-center max-w-4xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Transform Your Healthcare Experience</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Health Journey,
            <span className="block text-blue-600 mt-2">Made Simple</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Healthcare was never meant to be complicated. We've redesigned the entire experience into 
            <span className="font-semibold text-blue-700"> three seamless steps</span>—clear, intelligent, and human-centered.
          </p>
        </div>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block relative mb-24">
          {/* Connecting Line Background */}
          <div className="absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-blue-100 to-blue-100 rounded-full z-0"></div>
          
          {/* Animated Progress Line */}
          <div 
            className="absolute top-32 left-0 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full z-10 transition-all duration-700 ease-out"
            style={{ width: `${progressWidth}%` }}
          ></div>
          
          {/* Steps Container */}
          <div className="relative z-20 grid grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative transition-all duration-500 ease-out ${
                  activeStep === index ? 'transform scale-105' : 'transform scale-100'
                }`}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setActiveStep(index);
                }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-xl transition-all duration-300 ${
                    activeStep === index 
                      ? 'bg-gradient-to-br from-blue-600 to-teal-500 scale-110 shadow-blue-200' 
                      : 'bg-white'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      activeStep === index ? 'text-white' : 'text-blue-600'
                    }`}>
                      {step.number}
                    </span>
                    {activeStep === index && (
                      <>
                        <div className="absolute -inset-2 rounded-full border-2 border-blue-400/50 animate-ping"></div>
                        <div className="absolute -inset-1 rounded-full border border-blue-300/30"></div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Step Card */}
                <div className={`bg-white rounded-2xl p-8 pt-16 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  activeStep === index 
                    ? 'border-blue-200 shadow-xl ring-2 ring-blue-50' 
                    : 'border-gray-100 hover:border-blue-100'
                }`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white transform rotate-3'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {step.icon}
                  </div>
                  
                  {/* Tagline */}
                  <div className="text-sm font-medium text-blue-600 mb-2">
                    {step.tagline}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Highlights */}
                  <ul className="space-y-3 mb-8">
                    {step.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <CheckCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                          activeStep === index ? 'text-green-500' : 'text-green-400'
                        }`} />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Stat Badge */}
                  <div className={`pt-6 border-t ${
                    activeStep === index ? 'border-blue-100' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors duration-300 ${
                        activeStep === index ? 'bg-blue-50' : 'bg-gray-50'
                      }`}>
                        <div className={activeStep === index ? 'text-blue-600' : 'text-gray-600'}>
                          {step.stat.icon}
                        </div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold transition-colors duration-300 ${
                          activeStep === index ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {step.stat.value}
                        </div>
                        <div className="text-sm text-gray-600">{step.stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden ${
                activeStep === index
                  ? 'border-blue-200 shadow-lg max-h-[800px]'
                  : 'border-gray-100 max-h-32'
              }`}
              onClick={() => setActiveStep(index)}
            >
              {/* Step Header */}
              <div className="flex items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300 ${
                  activeStep === index
                    ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-blue-600 mb-1">
                        Step {step.number}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {step.title}
                      </h3>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ml-2 ${
                      activeStep === index ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <p className={`text-gray-600 mt-3 text-sm transition-opacity duration-300 ${
                    activeStep === index ? 'opacity-100' : 'opacity-0 h-0'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Expandable Content */}
              <div className={`transition-all duration-500 ease-in-out ${
                activeStep === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Highlights */}
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {step.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Stat */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                        {step.stat.icon}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">{step.stat.value}</div>
                        <div className="text-sm text-gray-600">{step.stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why This Matters */}
        <div className={`mt-24 text-center transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-3xl -rotate-1"></div>
              
              {/* Content */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-blue-100">
                <Shield className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-6" />
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Why This Matters
                </h3>
                
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Because healthcare isn't about one appointment. It's about continuity. 
                  It's about trust. It's about feeling supported—every step of the way.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">15 min</div>
                    <div className="text-gray-700 font-medium">Average wait time</div>
                    <div className="text-sm text-gray-600">vs. 2 weeks traditional</div>
                  </div>
                  
                  <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                  
                  <div className="text-center sm:text-left">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">94%</div>
                    <div className="text-gray-700 font-medium">Patient satisfaction</div>
                    <div className="text-sm text-gray-600">Based on 10,000+ reviews</div>
                  </div>
                  
                  <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                  
                  <div className="text-center sm:text-left">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
                    <div className="text-gray-700 font-medium">Care availability</div>
                    <div className="text-sm text-gray-600">Always here for you</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={`mt-20 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Expert care is no longer distant, delayed, or disconnected.
            </h3>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of patients who have already transformed how they experience healthcare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
  href="/get-started" 
  size="lg"
  className="bg-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
  icon={<ChevronRight className="ml-2" />}
>
  Start Your Journey Today
</Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Schedule a Consultation
                </span>
              </Button>
            </div>
            
            <p className="mt-8 text-gray-500 text-sm">
              No credit card required • First consultation free • Cancel anytime
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-30 blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default HowItWorks;
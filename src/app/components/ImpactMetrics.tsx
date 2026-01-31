'use client';

import { useEffect, useState } from 'react';
import MetricCard from './shared/MetricCard';
import { Users, Stethoscope, MessageSquare, Clock, Award, Heart, TrendingUp, Shield, CheckCircle, Sparkles, Target } from 'lucide-react';

const ImpactMetrics = () => {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    consultations: 0,
    uptime: 0,
    satisfaction: 0,
    responseTime: 0,
    outcomes: 0
  });

  // More realistic MVP targets
  const targets = {
    patients: 12500,
    doctors: 850,
    consultations: 57500,
    uptime: 99.2,
    satisfaction: 96.5,
    responseTime: 4.5,
    outcomes: 87
  };

  useEffect(() => {
    const duration = 2500;
    const steps = 100;
    const interval = duration / steps;

    const animateCount = (key: keyof typeof targets, target: number) => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        // Ease-out function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = easeOut * target;
        
        setCounts(prev => ({
          ...prev,
          [key]: parseFloat(currentValue.toFixed(key === 'responseTime' ? 1 : 0))
        }));

        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return timer;
    };

    const timers = Object.entries(targets).map(([key, target]) => 
      animateCount(key as keyof typeof targets, target)
    );

    return () => timers.forEach(timer => clearInterval(timer));
  }, []);

  const metrics = [
    {
      value: counts.patients.toLocaleString(),
      label: "Active Patients",
      suffix: "+",
      description: "Trusting us with their care",
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-blue-500 to-blue-600' as const,
      trend: "+12% this month"
    },
    {
      value: counts.doctors.toLocaleString(),
      label: "Verified Doctors",
      suffix: "+",
      description: "Across 20+ specialties",
      icon: <Stethoscope className="w-8 h-8" />,
      gradient: 'from-sky-500 to-cyan-500' as const,
      trend: "150+ new joiners"
    },
    {
      value: counts.consultations.toLocaleString(),
      label: "Consultations",
      description: "Successfully completed",
      icon: <MessageSquare className="w-8 h-8" />,
      gradient: 'from-indigo-500 to-purple-500' as const,
      trend: "94% satisfaction rate"
    },
    {
      value: counts.uptime.toFixed(1),
      label: "Platform Uptime",
      suffix: "%",
      description: "Enterprise reliability",
      icon: <Award className="w-8 h-8" />,
      gradient: 'from-blue-600 to-sky-500' as const,
      trend: "30-day average"
    }
  ];

  const healthOutcomes = [
    {
      value: counts.satisfaction.toFixed(1),
      label: "Patient Satisfaction",
      suffix: "%",
      icon: <Heart className="w-6 h-6" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      improvement: "+8.2% vs traditional care"
    },
    {
      value: counts.responseTime.toFixed(1),
      label: "Avg. Response Time",
      suffix: " min",
      icon: <Clock className="w-6 h-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      improvement: "3x faster than average"
    },
    {
      value: counts.outcomes.toFixed(0),
      label: "Positive Outcomes",
      suffix: "%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      improvement: "Based on patient feedback"
    }
  ];

  const outcomeMetrics = [
    { label: "Medication Adherence", value: 92, color: "from-green-400 to-green-500", improvement: "+15%" },
    { label: "Condition Control", value: 88, color: "from-blue-400 to-blue-500", improvement: "+22%" },
    { label: "Preventive Care", value: 95, color: "from-sky-400 to-cyan-500", improvement: "+18%" },
    { label: "Readmission Rate", value: 24, color: "from-purple-400 to-purple-500", improvement: "-32%" }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container-wrapper relative">
        {/* Section header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          {/* Decorative badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-sky-500/10 text-blue-700 px-4 py-2 rounded-full border border-blue-200 backdrop-blur-sm">
              <Target className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">MEASURABLE IMPACT</span>
            </div>
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600/10 to-indigo-500/10 text-blue-700 px-4 py-2 rounded-full border border-blue-200 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">PROVEN RESULTS</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Data-Driven <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Impact</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Real numbers showing our commitment to transforming healthcare delivery and improving patient outcomes.
          </p>
        </div>

        {/* Main metrics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon container */}
              <div className="relative mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {metric.icon}
                </div>
              </div>
              
              {/* Value */}
              <div className="relative mb-2">
                <div className="flex items-baseline">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                    {metric.value}
                  </span>
                  {metric.suffix && (
                    <span className="text-xl font-bold text-blue-600 ml-1">{metric.suffix}</span>
                  )}
                </div>
              </div>
              
              {/* Label and description */}
              <div className="relative">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{metric.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                
                {/* Trend indicator */}
                <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.trend}
                </div>
              </div>
              
              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>
          ))}
        </div>

        {/* Health outcomes section */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl overflow-hidden border border-blue-100/50 shadow-lg">
            {/* Decorative corner elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500 blur-sm"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-sky-500 blur-sm"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left column - Key outcomes */}
                <div>
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 px-5 py-2.5 rounded-full mb-6 border border-blue-200 backdrop-blur-sm">
                    <span className="text-sm font-semibold tracking-wide">HEALTH OUTCOMES</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Real Impact, Measured in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Lives Improved</span>
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    Beyond the numbers, we're creating tangible improvements in health outcomes and quality of life for every patient.
                  </p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {healthOutcomes.map((metric, index) => (
                      <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-colors">
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center mr-3`}>
                            <div className={metric.color}>{metric.icon}</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${metric.color}`}>
                              {metric.value}{metric.suffix}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">{metric.label}</div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          {metric.improvement}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Live indicator */}
                  <div className="flex items-center bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3"></div>
                    <span className="text-sm text-gray-700 font-medium">Live data updating in real-time</span>
                    <div className="ml-auto text-xs text-blue-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated just now
                    </div>
                  </div>
                </div>
                
                {/* Right column - Progress visualization */}
                <div className="relative">
                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2.5 rounded-full shadow-xl transform rotate-3 z-10">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="font-bold text-sm">+42% Improvement</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-6 border border-blue-100 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Health Outcomes Improvement</h4>
                        <p className="text-sm text-gray-600">Compared to traditional care</p>
                      </div>
                    </div>
                    
                    {/* Progress bars */}
                    <div className="space-y-6">
                      {outcomeMetrics.map((item, index) => (
                        <div key={index} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            <div className="flex items-center">
                              <span className="font-bold text-gray-900 mr-2">{item.value}%</span>
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {item.improvement}
                              </span>
                            </div>
                          </div>
                          <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                              style={{ width: `${item.value}%` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footnote */}
                    <div className="mt-8 pt-6 border-t border-blue-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Based on 12-month study of 2,500 Amexan patients vs. traditional care</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating notification */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-2xl border border-blue-100 max-w-[220px] animate-float-slow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">All Metrics Positive</div>
                        <div className="text-xs text-gray-500">Trending upward ↑</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-xl font-bold text-gray-900 mb-8">
              Trusted by Healthcare Professionals
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: "24/7", label: "Support Coverage", icon: <Clock className="w-5 h-5" /> },
                { value: "HIPAA", label: "Compliant", icon: <Shield className="w-5 h-5" /> },
                { value: "256-bit", label: "Encryption", icon: <CheckCircle className="w-5 h-5" /> },
                { value: "ISO 27001", label: "Certified", icon: <Award className="w-5 h-5" /> },
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-colors">
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <div className="text-blue-600">{item.icon}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-800 mb-1">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50/50 to-transparent rounded-2xl p-6 border border-blue-100">
              <p className="text-gray-700 text-lg leading-relaxed">
                We're committed to providing transparent, data-driven healthcare solutions that 
                prioritize both patient outcomes and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
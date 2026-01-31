import Button from './Shared/Button';
import { ArrowRight, Shield, Clock, Users, CheckCircle } from 'lucide-react';

const CallToAction = () => {
  const benefits = [
    "No long-term contracts",
    "Cancel anytime",
    "HIPAA compliant",
    "24/7 customer support",
    "Family plans available",
    "Insurance integration"
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-wrapper">
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-8 md:p-16 text-white overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Limited Time Offer</span>
            </div>
            
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Take Control of Your <span className="text-accent-300">Health Future</span> Today
            </h2>
            
            {/* Subheading */}
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands who have already transformed their healthcare experience. 
              Your first month includes unlimited telemedicine consultations and personalized health planning.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                href="/signup" 
                size="lg" 
                className="bg-white text-primary-700 hover:bg-gray-100 shadow-2xl"
                icon={<ArrowRight className="ml-2" />}
              >
                Start Free 30-Day Trial
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="text-white border-2 border-white/30 hover:bg-white/10"
              >
                Speak with Sales
              </Button>
            </div>
            
            {/* Benefits grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-accent-300 mb-2" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Stats footer */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/30">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-accent-300 mr-2" />
                <span className="font-medium">Average signup: 3 minutes</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-accent-300 mr-2" />
                <span className="font-medium">Join 100K+ satisfied members</span>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 opacity-20 animate-float"></div>
          <div className="absolute bottom-12 left-12 w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-teal-300 opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-white opacity-10 animate-pulse-glow"></div>
        </div>
        
        {/* Footer note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            <strong>Note:</strong> Amexan is a comprehensive healthcare platform that complements 
            but does not replace emergency medical services. In case of emergency, please call your 
            local emergency number immediately.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <span>© 2024 Amexan Health Technologies</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
'use client';

import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Shield, Clock, ArrowRight, ChevronRight, Download, Award, CheckCircle, Zap, Sparkles } from 'lucide-react';
import Button from './Shared/Button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would call an API here
      console.log('Subscribed:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'For Patients', links: ['Get Started', 'Virtual Consultations', 'Medication Delivery', 'Health Monitoring', 'Insurance Coverage'] },
    { name: 'For Doctors', links: ['Join Our Network', 'Telemedicine Platform', 'Patient Management', 'Continuing Education', 'Billing & Payments'] },
    { name: 'Company', links: ['About Us', 'Careers', 'Press & Media', 'Blog', 'Research'] },
    { name: 'Resources', links: ['Help Center', 'Patient Stories', 'Health Library', 'Webinars', 'Clinical Trials'] },
  ];

  const appStores = [
    { name: 'App Store', icon: <Apple className="w-6 h-6" />, badge: 'Download on the', rating: '4.9 ★' },
    { name: 'Google Play', icon: <PlayStore className="w-6 h-6" />, badge: 'Get it on', rating: '4.8 ★' },
  ];

  const certifications = [
    { name: 'HIPAA Compliant', icon: <Shield className="w-4 h-4" /> },
    { name: 'ISO 27001', icon: <Award className="w-4 h-4" /> },
    { name: 'GDPR Ready', icon: <CheckCircle className="w-4 h-4" /> },
    { name: 'SOC 2 Type II', icon: <Zap className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { platform: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: '#' },
    { platform: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: '#' },
    { platform: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: '#' },
    { platform: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: '#' },
    { platform: 'YouTube', icon: <Youtube className="w-5 h-5" />, url: '#' },
  ];

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: '1-800-AMEXAN9', subtext: '24/7 Support Line' },
    { icon: <Mail className="w-4 h-4" />, text: 'help@amexan.com', subtext: 'General Inquiries' },
    { icon: <Clock className="w-4 h-4" />, text: 'Mon-Sun: 24/7', subtext: 'Always Available' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50/30"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"></div>
      
      {/* Main Footer Content */}
      <div className="relative">
        {/* Top CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container-wrapper py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ready to Transform Your Healthcare Experience?</h3>
                  <p className="text-blue-100">Join thousands of satisfied patients today</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  href="/signup"
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-lg"
                  icon={<ArrowRight className="ml-2" />}
                >
                  Start Free Trial
                </Button>
                <Button
                  href="/demo"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="container-wrapper py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Brand & Contact */}
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Amexan</h2>
                    <p className="text-sm text-blue-600 font-medium">Intelligent Healthcare Platform</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your smart healthcare partner — connecting patients, doctors, pharmacies, and labs 
                  in one seamless ecosystem for safer, smarter living.
                </p>
                
                {/* Contact Information */}
                <div className="space-y-3 mb-8">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <div className="text-blue-600">{item.icon}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.text}</div>
                        <div className="text-sm text-gray-500">{item.subtext}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* App Download Badges */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-3">Download Our App</h4>
                  <div className="flex gap-3">
                    {appStores.map((store, index) => (
                      <button
                        key={index}
                        className="flex items-center bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors group flex-1 max-w-[180px]"
                      >
                        <div className="mr-3 group-hover:scale-110 transition-transform">
                          {store.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-xs opacity-80">{store.badge}</div>
                          <div className="font-bold">{store.name}</div>
                          <div className="text-xs mt-1 text-yellow-400">{store.rating}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Links Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {quickLinks.map((section, index) => (
                <div key={index}>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    {section.name}
                    <ChevronRight className="w-4 h-4 ml-2 text-blue-500" />
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href="#" 
                          className="flex items-center text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-300 group"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-200 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="grid lg:grid-cols-2 gap-12 pt-8 border-t border-blue-100">
            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Stay Updated with Health Insights</h4>
              <p className="text-gray-600 mb-6 max-w-lg">
                Subscribe to receive the latest health tips, product updates, and exclusive offers.
                No spam, ever.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-lg">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    required
                  />
                  <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    subscribed
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>10,000+ healthcare professionals already subscribed</span>
              </div>
            </div>

            {/* Social & Certifications */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Connect With Us</h4>
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-300 group"
                    aria-label={social.platform}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-3">
                {certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-gradient-to-br from-white to-blue-50 px-4 py-2 rounded-lg border border-blue-100"
                  >
                    <div className="text-blue-500 mr-2">{cert.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gradient-to-r from-blue-50/50 to-white border-t border-blue-100">
          <div className="container-wrapper">
            <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
              <div className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Amexan Healthcare Technologies. All rights reserved.
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Cookie Policy
                </a>
                <a href="/hipaa" className="text-gray-600 hover:text-blue-600 transition-colors">
                  HIPAA Compliance
                </a>
                <a href="/accessibility" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Accessibility
                </a>
                <a href="/sitemap" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Sitemap
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-blue-100 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>Your data is 100% secure and encrypted</span>
              </div>
              <div className="w-px h-4 bg-blue-200"></div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                <span>Committed to improving healthcare access</span>
              </div>
              <div className="w-px h-4 bg-blue-200"></div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>Serving patients in 50+ countries</span>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="py-4 border-t border-blue-100">
              <p className="text-xs text-gray-500 text-center max-w-3xl mx-auto">
                <strong className="font-medium">Disclaimer:</strong> Amexan provides telemedicine services and is not a replacement 
                for emergency medical care. In case of a medical emergency, please call your local emergency services 
                immediately. Always consult with a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Custom icons for app stores (you can replace these with actual icons)
const Apple = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.76 3.28-.76 2 .76 3.3.73 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z"/>
  </svg>
);

const PlayStore = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941a1.438 1.438 0 0 1-1.724-.417 1.422 1.422 0 0 1-.137-1.725zm.522-15.093l11.735-6.504a1.44 1.44 0 0 1 1.759.404l2.813 3.059-13.912 12.878zm21.089-8.405c-.082-.078-1.979-2.18-5.446-2.18-3.028.119-6.439 2.278-8.34 4.006l7.929 7.207 1.263-1.099 4.594-4.143c.583-.514.88-1.199.88-1.893 0-.698-.297-1.386-.88-1.902zm-5.979 8.869l-3.12 2.715 3.554 3.231 5.573-3.231a1.75 1.75 0 0 0 .757-1.563 1.78 1.78 0 0 0-.757-1.562z"/>
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default Footer;
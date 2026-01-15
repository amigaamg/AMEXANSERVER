import React from 'react';
import { Shield, Users, Activity, Calendar, Heart, FileText, Clock, Video } from 'lucide-react';

const DeviceMockupsBottom = () => {
  return (
    <div className="relative" style={{ height: '500px' }}>
      {/* Left Tablet with Doctor */}
      <div className="absolute left-8 top-8 w-[320px] z-20 animate-float" style={{ animationDelay: '0.3s', animationDuration: '3.8s' }}>
        <div className="bg-gray-800 rounded-3xl p-3 shadow-2xl">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-sm font-bold">Doctor Name</span>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">Dr. Sarah Johnson</div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">Call</button>
                </div>
              </div>
              
              <div className="bg-blue-600 text-white rounded-xl p-4">
                <div className="text-xs mb-2">User Profile Information</div>
                <div className="text-sm font-semibold">View Details</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Laptop */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] z-10 animate-float" style={{ animationDuration: '4s' }}>
        <div className="bg-gray-800 rounded-t-2xl p-2 shadow-2xl">
          <div className="bg-white rounded-t-lg overflow-hidden">
            <div className="bg-gradient-to-br from-white to-blue-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                  <span className="text-sm font-bold">ALECIAN</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md mb-3">
                <div className="text-lg font-bold mb-3">Patient Dashboard</div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs font-semibold mb-1">Doctor Session</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs font-semibold mb-1">Remote Session Inc</div>
                    <div className="text-xs text-gray-600">Consult</div>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 bg-cyan-600 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs font-semibold mb-1">Session Remote</div>
                    <div className="text-xs text-gray-600">Schedule</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { value: '23%', color: 'blue' },
                    { value: '34%', color: 'green' },
                    { value: '45%', color: 'purple' },
                    { value: '78%', color: 'orange' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full border-2 border-${stat.color}-500 flex items-center justify-center mb-1`}>
                        <span className="text-xs font-bold">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold mb-2">Medicine not on Calendar</div>
                  <div className="space-y-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <div className="text-xs text-gray-600">Item {i}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 h-5 rounded-b-2xl"></div>
      </div>

      {/* Right Top Phone */}
      <div className="absolute right-12 top-12 w-[180px] z-20 animate-float" style={{ animationDelay: '0.7s', animationDuration: '3.5s' }}>
        <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[1.5rem] overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-white p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <div className="text-[10px] font-bold">Remote</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm mb-2">
                <div className="w-full h-16 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg mb-2"></div>
                <div className="text-xs font-semibold mb-1">Doctor Profile</div>
                <div className="text-[10px] text-gray-600">Specialist Information</div>
              </div>
              
              <div className="space-y-1">
                <div className="bg-blue-50 rounded-lg p-2 text-xs">Remote Session 1</div>
                <div className="bg-purple-50 rounded-lg p-2 text-xs">Remote Session 2</div>
                <div className="bg-cyan-50 rounded-lg p-2 text-xs">Remote Session 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Bottom Phone */}
      <div className="absolute right-4 bottom-8 w-[180px] z-20 animate-float" style={{ animationDelay: '1.2s', animationDuration: '4.2s' }}>
        <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[1.5rem] overflow-hidden">
            <div className="bg-gradient-to-br from-white to-blue-50 p-3">
              <div className="text-xs font-bold mb-3">Patient List</div>
              
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-[10px] font-semibold">Patient {i}</div>
                      <div className="text-[9px] text-gray-600">Details</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-blue-600 text-white rounded-lg py-2 text-xs font-semibold mt-3">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Three Step Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              number: '01',
              title: 'Sign Up Securely',
              description: 'If we promote entity partner our cities, watch on a lemfood user monitoring.',
              color: 'blue'
            },
            {
              number: '02',
              title: 'Choose Your Care',
              description: 'Remote setting consult a eteous. Coper ed healthcare selication.',
              color: 'purple'
            },
            {
              number: '03',
              title: 'Consult Securely',
              description: 'Sen sity heels eased lettion em your porthecers, acfluating uned health care.',
              color: 'cyan'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}-100 rounded-full opacity-20 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className={`text-${feature.color}-600 text-7xl font-bold opacity-10 mb-4`}>
                {feature.number}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Device Mockups */}
        <DeviceMockupsBottom />

        {/* Security Features Section */}
        <div className="mt-32 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: 'End-To-End Encryption',
                    description: 'Foolscuro uam teesseam et ornamentum tenris. ante eu elit sagittis yorn fluenculus ex orues.',
                    color: 'blue'
                  },
                  {
                    icon: Users,
                    title: 'Role-Based Access',
                    description: 'Uvaracus risquam euismod adipicsng fackons. aue bem sed lec suscisetistur for ratos.',
                    color: 'purple'
                  },
                  {
                    icon: FileText,
                    title: 'Audit Logs',
                    description: 'Equipome eu cursien choingly wands eget ruspensrs aper clestum scantaturs.',
                    color: 'cyan'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`bg-${feature.color}-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl">
                  <Shield className="w-16 h-16 mb-4" />
                  <h3 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h3>
                  <p className="text-blue-100 mb-6">
                    Your data is protected with military-grade encryption and compliance with all healthcare regulations including HIPAA.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>256-bit SSL Encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>HIPAA Compliant</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Regular Security Audits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Features;
import { ReactNode } from 'react';

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: 'blue' | 'teal' | 'purple';
  className?: string;
}

const IconCard = ({ icon, title, description, gradient = 'blue', className = '' }: IconCardProps) => {
  const gradientClasses = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
  };
  
  return (
    <div className={`group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${className}`}>
      {/* Gradient background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
      
      {/* Animated icon container */}
      <div className="relative mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]} p-3 text-white transform group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-2xl">
            {icon}
          </div>
        </div>
        
        {/* Floating dots decoration */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-gradient-to-r from-primary-300 to-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '100ms' }}></div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      
      {/* Subtle hover indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-full transition-all duration-500"></div>
    </div>
  );
};

export default IconCard;
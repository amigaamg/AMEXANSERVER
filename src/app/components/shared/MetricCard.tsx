import { ReactNode } from 'react';

interface MetricCardProps {
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: ReactNode;
  gradient?: 'blue' | 'teal' | 'purple' | 'orange';
  animate?: boolean;
}

const MetricCard = ({ 
  value, 
  label, 
  prefix = '', 
  suffix = '', 
  description, 
  icon, 
  gradient = 'blue',
  animate = true 
}: MetricCardProps) => {
  const gradientClasses = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };
  
  return (
    <div className="relative group">
      {/* Animated background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${animate ? 'animate-pulse' : ''}`}></div>
      
      {/* Card content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
        {/* Icon */}
        {icon && (
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]} text-white p-2`}>
              {icon}
            </div>
          </div>
        )}
        
        {/* Value with animation */}
        <div className="mb-2">
          <div className={`text-4xl md:text-5xl font-bold ${animate ? 'gradient-text' : 'text-gray-900'}`}>
            {prefix}
            <span className={animate ? 'count-up' : ''}>{value}</span>
            {suffix}
          </div>
        </div>
        
        {/* Label */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{label}</h3>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
        
        {/* Animated underline */}
        <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transform group-hover:w-24 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default MetricCard;
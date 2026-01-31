import { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl focus:ring-primary-500',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow focus:ring-gray-400',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  // Heartbeat animation for primary buttons
  const animationClass = variant === 'primary' ? 'hover:animate-heartbeat' : '';
  
  if (href) {
    return (
      <Link href={href} className={`${buttonClasses} ${animationClass}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={`${buttonClasses} ${animationClass}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
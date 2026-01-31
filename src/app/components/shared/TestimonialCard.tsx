import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
  rating?: number;
  className?: string;
}

const TestimonialCard = ({ 
  quote, 
  name, 
  role, 
  imageSrc, 
  rating = 5, 
  className = '' 
}: TestimonialCardProps) => {
  return (
    <div className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Quote marks decoration */}
      <div className="absolute top-6 left-6 text-5xl text-primary-100 font-serif leading-none">"</div>
      
      {/* Rating stars */}
      <div className="flex mb-6">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      {/* Quote text */}
      <p className="text-gray-700 text-lg italic mb-8 relative z-10">
        {quote}
      </p>
      
      {/* Author info */}
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary-100">
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default TestimonialCard;
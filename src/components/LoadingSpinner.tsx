import React from 'react';
import { Loader2, Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showLogo?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text, showLogo = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {showLogo && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mb-2">
          <Shield className="h-8 w-8 text-white" />
        </div>
      )}
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-blue-200 rounded-full animate-pulse`}></div>
      </div>
      {text && (
        <div className="text-center">
          <p className="text-gray-700 font-medium">{text}</p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
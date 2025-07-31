import React from 'react';
import { Globe, Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, theme } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      className={`relative group flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
        theme === 'dark'
          ? 'text-gray-300 hover:text-white hover:bg-gray-700/80 border-gray-600/50 hover:border-blue-500/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 border-gray-200/50 hover:border-blue-300/50'
      }`}
      aria-label="Toggle language"
      title={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="relative z-10">
        <Languages className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </div>

      {/* Language Text */}
      <span className="text-sm font-medium relative z-10 group-hover:scale-105 transition-transform duration-200">
        {language === 'ar' ? 'EN' : 'عربي'}
      </span>

      {/* Language Indicator */}
      <div className="relative z-10 flex items-center">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          language === 'ar'
            ? 'bg-green-500 shadow-lg shadow-green-500/30'
            : 'bg-blue-500 shadow-lg shadow-blue-500/30'
        }`} />
      </div>

      {/* Hover Glow */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
        theme === 'dark'
          ? 'shadow-lg shadow-blue-500/20'
          : 'shadow-lg shadow-blue-500/10'
      }`} />
    </button>
  );
};

export default LanguageToggle;

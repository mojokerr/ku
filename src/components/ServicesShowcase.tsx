import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, CreditCard, ArrowLeft, CheckCircle, Star, Zap, Shield, 
  Users, Clock, ChevronLeft, ChevronRight, Sparkles, Target,
  TrendingUp, Award, Globe, Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

interface ServicesShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
}

const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({ 
  isOpen, 
  onClose, 
  onSelectService 
}) => {
  // Hooks
  const { services } = useData();
  const { theme, language } = useTheme();
  const { t } = useTranslation(language);

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized data
  const activeServices = useMemo(() => 
    services.filter(service => service.active),
    [services]
  );

  const categories = useMemo(() => [
    { 
      id: 'all', 
      name: language === 'ar' ? 'جميع الخدمات' : 'All Services', 
      icon: Star,
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      id: 'wallets', 
      name: language === 'ar' ? 'المحافظ الرقمية' : 'Digital Wallets', 
      icon: CreditCard,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'crypto', 
      name: language === 'ar' ? 'العملات الرقمية' : 'Cryptocurrency', 
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'banking', 
      name: language === 'ar' ? 'الخدمات المصرفية' : 'Banking Services', 
      icon: Shield,
      color: 'from-purple-500 to-violet-500'
    },
    { 
      id: 'local', 
      name: language === 'ar' ? 'خدمات محلية' : 'Local Services', 
      icon: Target,
      color: 'from-pink-500 to-rose-500'
    },
  ], [language]);

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    let filtered = activeServices;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => {
        const serviceName = service.name.toLowerCase();
        switch (selectedCategory) {
          case 'wallets':
            return ['payoneer', 'wise', 'paypal', 'skrill', 'neteller'].some(name => 
              serviceName.includes(name)
            );
          case 'crypto':
            return ['okx', 'bybit', 'bitget', 'kucoin', 'mexc'].some(name => 
              serviceName.includes(name)
            );
          case 'banking':
            return ['world first', 'exness'].some(name => 
              serviceName.includes(name)
            );
          case 'local':
            return serviceName.includes('فودافون') || serviceName.includes('tiktok');
          default:
            return true;
        }
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.price.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeServices, selectedCategory, searchQuery]);

  // Navigation handlers
  const nextSlide = () => {
    if (isAnimating || filteredServices.length <= 3) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredServices.length / 3));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating || filteredServices.length <= 3) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(filteredServices.length / 3)) % Math.ceil(filteredServices.length / 3));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSelectService = (serviceName: string) => {
    onSelectService(serviceName);
    onClose();
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
      setSearchQuery('');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900 border border-gray-700 shadow-black/50' 
          : 'bg-white border border-gray-100 shadow-gray-500/20'
      }`}>
        
        {/* Header Section */}
        <div className={`px-8 py-6 border-b backdrop-blur-sm ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gray-800/90' 
            : 'border-gray-100 bg-gray-50/90'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                خدماتنا المتميزة
              </h2>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                نقدم مجموعة شاملة من الخدمات المالية الرقمية المصممة خصيصاً لتلبية احتياجاتك
              </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={`p-3 rounded-full transition-all duration-200 group ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في الخدمات...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className={`px-8 py-4 border-b backdrop-blur-sm ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex space-x-reverse space-x-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentIndex(0);
                }}
                className={`flex items-center space-x-reverse space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap group ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <category.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                    {filteredServices.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Content */}
        <div className="px-8 py-8 max-h-[60vh] overflow-y-auto">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <div className={`bg-gradient-to-br ${
                theme === 'dark' ? 'from-gray-700 to-gray-800' : 'from-gray-100 to-gray-200'
              } p-8 rounded-3xl inline-block mb-6`}>
                <CreditCard className={`h-16 w-16 mx-auto ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'ar' ? 'لا توجد خدمات' : 'No services found'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {language === 'ar' 
                  ? 'جرب البحث بكلمات أخرى أو تغيير التصنيف' 
                  : 'Try searching with different keywords or change category'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Services Carousel */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className={`flex transition-transform duration-500 ease-in-out ${
                      isAnimating ? 'duration-300' : ''
                    }`}
                    style={{ 
                      transform: `translateX(${
                        language === 'ar' 
                          ? currentIndex * 100 
                          : -currentIndex * 100
                      }%)` 
                    }}
                  >
                    {Array.from({ length: Math.ceil(filteredServices.length / 3) }).map((_, pageIndex) => (
                      <div key={pageIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredServices
                            .slice(pageIndex * 3, (pageIndex + 1) * 3)
                            .map((service, serviceIndex) => (
                            <div
                              key={service.id}
                              className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border border-gray-700 hover:border-blue-500 shadow-lg hover:shadow-blue-500/20'
                                  : 'bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-blue-500/20'
                              }`}
                              style={{ animationDelay: `${serviceIndex * 100}ms` }}
                            >
                              {/* Service Header */}
                              <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                    <CreditCard className="h-8 w-8 text-white" />
                                  </div>
                                  <div className="flex items-center space-x-reverse space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                      {t('availableNow')}
                                    </span>
                                  </div>
                                </div>

                                <h3 className={`text-2xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {service.name}
                                </h3>

                                <div className="flex items-center justify-between mb-6">
                                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                    {service.price}
                                  </div>
                                  <div className="flex items-center space-x-reverse space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                  {[t('instantProcessing'), t('highSecurity'), t('support24')].map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-reverse space-x-3">
                                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                      <span className={`text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                      }`}>
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Order Button */}
                                <button
                                  onClick={() => handleSelectService(service.name)}
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                                >
                                  <span className="relative z-10 flex items-center justify-center space-x-reverse space-x-3">
                                    <span>{t('orderNow')}</span>
                                    <ArrowLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-2 transition-transform" />
                                  </span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                              </div>

                              {/* Animated Background Effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {Math.ceil(filteredServices.length / 3) > 1 && (
                  <>
                    <button
                      onClick={language === 'ar' ? nextSlide : prevSlide}
                      disabled={isAnimating}
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                          : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                      } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={language === 'ar' ? prevSlide : nextSlide}
                      disabled={isAnimating}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                          : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                      } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Pagination Dots */}
              {Math.ceil(filteredServices.length / 3) > 1 && (
                <div className="flex justify-center mt-8 space-x-reverse space-x-3">
                  {Array.from({ length: Math.ceil(filteredServices.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? 'w-8 bg-gradient-to-r from-blue-600 to-purple-600'
                          : theme === 'dark'
                          ? 'w-3 bg-gray-600 hover:bg-gray-500'
                          : 'w-3 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Stats Footer */}
        <div className={`px-8 py-6 border-t backdrop-blur-sm ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-900/90' 
            : 'border-gray-100 bg-gradient-to-r from-gray-50/90 to-white/90'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                icon: Users, 
                value: '5000+', 
                label: t('satisfiedClients'), 
                color: 'text-blue-500',
                bgColor: 'bg-blue-50 dark:bg-blue-900/30'
              },
              { 
                icon: Clock, 
                value: '< 5 دقائق', 
                label: t('executionSpeed'), 
                color: 'text-green-500',
                bgColor: 'bg-green-50 dark:bg-green-900/30'
              },
              { 
                icon: Shield, 
                value: '99.9%', 
                label: t('successRate'), 
                color: 'text-purple-500',
                bgColor: 'bg-purple-50 dark:bg-purple-900/30'
              },
              { 
                icon: Zap, 
                value: '24/7', 
                label: t('support247'), 
                color: 'text-orange-500',
                bgColor: 'bg-orange-50 dark:bg-orange-900/30'
              },
            ].map((stat, index) => (
              <div key={index} className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${stat.bgColor}`}>
                <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color}`} />
                <div className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;

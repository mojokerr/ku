import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, MessageCircle, CheckCircle, Quote, Play, Pause,
  ChevronLeft, ChevronRight, User, Heart, Award, Verified
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  featured?: boolean;
  videoUrl?: string;
  tags?: string[];
}

interface AdvancedTestimonialsProps {
  className?: string;
}

const AdvancedTestimonials: React.FC<AdvancedTestimonialsProps> = ({ className = '' }) => {
  const { theme, language } = useTheme();
  const { t } = useTranslation(language);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Enhanced testimonials data
  const testimonials: Testimonial[] = useMemo(() => [
    {
      id: 1,
      name: 'أحمد محمد العلي',
      role: 'مدير أعمال',
      company: 'شركة التطوير الرقمي',
      avatar: '👨‍💼',
      rating: 5,
      comment: 'خدمة ممتازة وسريعة جداً! تم إنجاز طلبي في أقل من 5 دقائق بجودة عالية. فريق الدعم محترف ومتجاوب. أنصح بشدة بالتعامل مع KYCtrust لجميع الخدمات المالية.',
      date: '2024-11-20',
      verified: true,
      featured: true,
      tags: ['سرعة', 'جودة', 'دعم ممتاز']
    },
    {
      id: 2,
      name: 'فاطمة السالم',
      role: 'مؤسسة شركة ناشئة',
      company: 'تك ستارت',
      avatar: '👩‍💼',
      rating: 5,
      comment: 'أفضل منصة للخدمات المالية الرقمية! الأمان عالي جداً والأسعار مناسبة. استخدمتها لتأسيس شركتي وكا��ت تجربة رائعة من البداية للنهاية.',
      date: '2024-11-18',
      verified: true,
      featured: true,
      tags: ['أمان', 'أسعار مناسبة', 'سهولة']
    },
    {
      id: 3,
      name: 'خالد العتيبي',
      role: 'مطور تطبيقات',
      company: 'فريلانسر',
      avatar: '👨‍💻',
      rating: 5,
      comment: 'تعاملت معهم أكثر من 15 مرة ولم أواجه أي مشكلة. السرعة في التنفيذ والشفافية في التعامل هي أهم ما يميزهم. أعتمد عليهم في جميع معاملاتي المالية.',
      date: '2024-11-15',
      verified: true,
      tags: ['موثوقية', 'شفافية', 'خبرة']
    },
    {
      id: 4,
      name: 'مريم أحمد',
      role: 'مديرة مشاريع',
      company: 'الشركة الوطنية',
      avatar: '👩‍🏫',
      rating: 5,
      comment: 'خدمة استثنائية! الموقع سهل الاستخدام والدعم الفني يرد في أقل من دقيقة. تم حل جميع استفساراتي بطريقة مهنية وودودة.',
      date: '2024-11-12',
      verified: true,
      tags: ['سهولة استخدام', 'دعم سريع', 'مهنية']
    },
    {
      id: 5,
      name: 'سعد الأحمد',
      role: 'رجل أعمال',
      company: 'مجموعة الأحمد التجارية',
      avatar: '👨‍🎯',
      rating: 5,
      comment: 'منصة موثوقة 100%! استخدمتها لتحويلات دولية كبيرة وتمت بأمان تام. الرسوم معقولة مقارنة بالبنوك التقليدية.',
      date: '2024-11-10',
      verified: true,
      featured: true,
      tags: ['تحويلات دولية', 'أمان', 'رسوم معقولة']
    },
    {
      id: 6,
      name: 'نورا الزهراني',
      role: 'مصممة جرافيك',
      company: 'ستوديو الإبداع',
      avatar: '👩‍🎨',
      rating: 4,
      comment: 'تجربة رائعة! استخدمت الخدمة لاستلام أموالي من العملاء الأجانب. العملية بسيطة والواجهة جميلة وسهلة.',
      date: '2024-11-08',
      verified: true,
      tags: ['تجربة مستخدم', 'استلام أموال', 'بساطة']
    }
  ], []);

  // Categories
  const categories = useMemo(() => [
    { id: 'all', name: 'جميع الآراء', count: testimonials.length },
    { id: 'featured', name: 'مميزة', count: testimonials.filter(t => t.featured).length },
    { id: 'business', name: 'رجال أعمال', count: testimonials.filter(t => t.role.includes('أعمال') || t.role.includes('مدير')).length },
    { id: 'tech', name: 'تقنية', count: testimonials.filter(t => t.role.includes('مطور') || t.role.includes('تقني')).length }
  ], [testimonials]);

  // Filter testimonials
  const filteredTestimonials = useMemo(() => {
    switch (selectedCategory) {
      case 'featured':
        return testimonials.filter(t => t.featured);
      case 'business':
        return testimonials.filter(t => t.role.includes('أعمال') || t.role.includes('مدير'));
      case 'tech':
        return testimonials.filter(t => t.role.includes('مطور') || t.role.includes('تقني'));
      default:
        return testimonials;
    }
  }, [testimonials, selectedCategory]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredTestimonials.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredTestimonials.length]);

  // Navigation handlers
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredTestimonials.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(filteredTestimonials.length / 3)) % Math.ceil(filteredTestimonials.length / 3));
  };

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-full mb-6">
            <Heart className="h-4 w-4 text-green-600 ml-2" />
            <span className="text-green-600 font-medium text-sm">شهادات العملاء</span>
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            قصص <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              نجاح حقيقية
            </span>
          </h2>
          
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            اكتشف كيف ساعدنا آلاف العملاء في تحقيق أهدافهم المالية بأمان وسرعة
          </p>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentIndex(0);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-reverse space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg scale-105'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-white/20' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Auto-play Controls */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="text-sm">{isAutoPlaying ? 'إيقاف التشغيل' : 'تشغيل تلقائي'}</span>
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(${
                  language === 'ar' 
                    ? currentIndex * 100 
                    : -currentIndex * 100
                }%)` 
              }}
            >
              {Array.from({ length: Math.ceil(filteredTestimonials.length / 3) }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTestimonials
                      .slice(pageIndex * 3, (pageIndex + 1) * 3)
                      .map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        className={`relative group ${
                          theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700/50 hover:border-green-500/50'
                            : 'bg-white/80 border-gray-200/50 hover:border-green-300/50'
                        } backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* Quote Icon */}
                        <div className="absolute -top-4 -right-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Quote className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Featured Badge */}
                        {testimonial.featured && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center space-x-reverse space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                              <Award className="h-3 w-3" />
                              <span>مميز</span>
                            </div>
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center space-x-reverse space-x-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${
                                i < testimonial.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className={`text-lg leading-relaxed mb-8 relative z-10 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          "{testimonial.comment}"
                        </p>

                        {/* Tags */}
                        {testimonial.tags && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {testimonial.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Customer Info */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200/20">
                          <div className="flex items-center space-x-reverse space-x-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                                {testimonial.avatar}
                              </div>
                              {testimonial.verified && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Verified className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-reverse space-x-2">
                                <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {testimonial.name}
                                </h4>
                                {testimonial.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {testimonial.role}
                              </p>
                              {testimonial.company && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {testimonial.company}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(testimonial.date).toLocaleDateString('ar-EG')}
                          </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {Math.ceil(filteredTestimonials.length / 3) > 1 && (
            <>
              <button
                onClick={language === 'ar' ? nextSlide : prevSlide}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={language === 'ar' ? prevSlide : nextSlide}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {Math.ceil(filteredTestimonials.length / 3) > 1 && (
          <div className="flex justify-center mt-12 space-x-reverse space-x-3">
            {Array.from({ length: Math.ceil(filteredTestimonials.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-12 bg-gradient-to-r from-green-600 to-blue-600'
                    : theme === 'dark'
                    ? 'w-3 bg-gray-600 hover:bg-gray-500'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '15,000+', label: 'عميل راضٍ', icon: User },
            { value: '4.9/5', label: 'تقييم العملاء', icon: Star },
            { value: '99.9%', label: 'معدل الرضا', icon: Heart },
            { value: '24/7', label: 'دعم فني', icon: MessageCircle }
          ].map((stat, index) => (
            <div key={index} className={`text-center p-6 rounded-2xl backdrop-blur-sm border ${
              theme === 'dark' 
                ? 'bg-gray-800/30 border-gray-700/30' 
                : 'bg-white/30 border-gray-200/30'
            }`}>
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedTestimonials;

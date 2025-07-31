import React, { useState, useMemo } from 'react';
import { 
  Shield, Zap, Award, Globe, Lock, TrendingUp, 
  Users, Clock, CheckCircle, Star, ArrowRight,
  Sparkles, Target, Heart, Rocket, Eye, Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

interface Feature {
  id: number;
  icon: any;
  title: string;
  description: string;
  color: string;
  benefits: string[];
  stats?: {
    value: string;
    label: string;
  };
  interactive?: boolean;
}

interface FeatureShowcaseProps {
  className?: string;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ className = '' }) => {
  const { theme, language } = useTheme();
  const { t } = useTranslation(language);

  // State
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Enhanced features data
  const features: Feature[] = useMemo(() => [
    {
      id: 0,
      icon: Shield,
      title: 'أمان متطور',
      description: 'تشفير من الدرجة البنكية مع حماية شاملة لجميع معاملاتك المالية وبياناتك الشخصية',
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'تشفير SSL 256-bit متقدم',
        'مراقبة أمنية 24/7',
        'حماية من الاحتيال',
        'مصادقة ثنائية العوامل',
        'سياسات خصوصية صارمة'
      ],
      stats: {
        value: '99.99%',
        label: 'معدل الأمان'
      },
      interactive: true
    },
    {
      id: 1,
      icon: Zap,
      title: 'سرعة فائقة',
      description: 'معالجة فورية للطلبات والمعاملات في أقل من 5 دقائق مع ضمان الجودة والدقة',
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'معالجة فورية للطلبات',
        'تحويلات فورية للأموال',
        'استجابة سريعة من الدعم',
        'واجهة سريعة ومتجاوبة',
        'تحديثات لحظية للحالة'
      ],
      stats: {
        value: '< 5 دقائق',
        label: 'متوسط وقت المعالجة'
      },
      interactive: true
    },
    {
      id: 2,
      icon: Award,
      title: 'موثوقية عالية',
      description: 'ضمان الجودة والخدمة المتميزة مع فريق دعم محترف وخبرة أكثر من 5 سنوات',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'ضمان على جميع الخدمات',
        'فريق دعم محترف ومتخصص',
        'خبرة أكثر من 5 سنوات',
        'شهادات موثوقية دولية',
        'سجل حافل من النجاحات'
      ],
      stats: {
        value: '99.9%',
        label: 'معدل رضا العملاء'
      },
      interactive: true
    },
    {
      id: 3,
      icon: Globe,
      title: 'تغطية عالمية',
      description: 'خدماتنا متاحة في أكثر من 150 دولة حول العالم مع دعم متعدد العملات واللغات',
      color: 'from-purple-500 to-violet-500',
      benefits: [
        'خدمات في أكثر من 150 دولة',
        'د��م أكثر من 50 عملة',
        'شراكات عالمية موثوقة',
        'دعم متعدد اللغات',
        'تغطية جميع القارات'
      ],
      stats: {
        value: '150+',
        label: 'دولة مدعومة'
      },
      interactive: true
    },
    {
      id: 4,
      icon: TrendingUp,
      title: 'نمو مستمر',
      description: 'منصة في تطور مستمر مع إضافة ميزات جديدة وتحسينات دورية لتلبية احتياجاتك',
      color: 'from-indigo-500 to-purple-500',
      benefits: [
        'تحديثات دورية للنظام',
        'إضافة ميزات جديدة شهرياً',
        'تحسين مستمر للأداء',
        'استمع لاقتراحات العملاء',
        'ابتكار في الخدمات'
      ],
      stats: {
        value: '200%',
        label: 'نمو سنوي'
      }
    },
    {
      id: 5,
      icon: Heart,
      title: 'رضا العملاء',
      description: 'التركيز الكامل على رضا العملاء وتقديم تجربة استثنائية في كل تفاعل',
      color: 'from-pink-500 to-red-500',
      benefits: [
        'دعم فني 24/7',
        'حلول مخصصة لكل عميل',
        'است��ابة فورية للمشاكل',
        'برامج ولاء مميزة',
        'تجربة مستخدم متفوقة'
      ],
      stats: {
        value: '4.9/5',
        label: 'تقييم العملاء'
      }
    }
  ], []);

  // Auto-cycle through features
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  const selectedFeatureData = features[selectedFeature];

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 ml-2" />
            <span className="text-purple-600 font-medium text-sm">مميزاتنا الفريدة</span>
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            لماذا نحن <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              الخيار الأفضل؟
            </span>
          </h2>
          
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            نجمع بين الأمان والسرعة والموثوقية لنقدم لك أفضل تجربة في الخدمات المالية الرقمية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Features Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(index)}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`w-full text-right p-6 rounded-2xl transition-all duration-300 group ${
                    selectedFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105`
                      : theme === 'dark'
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                      : 'bg-white/50 text-gray-700 hover:bg-gray-50/80 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-reverse space-x-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      selectedFeature === index
                        ? 'bg-white/20 scale-110'
                        : `bg-gradient-to-r ${feature.color} group-hover:scale-110`
                    }`}>
                      <feature.icon className={`h-6 w-6 ${
                        selectedFeature === index ? 'text-white' : 'text-white'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:scale-105 transition-transform">
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        selectedFeature === index 
                          ? 'text-white/90' 
                          : theme === 'dark' 
                          ? 'text-gray-400' 
                          : 'text-gray-600'
                      }`}>
                        {feature.description.substring(0, 80)}...
                      </p>
                      {feature.stats && (
                        <div className="mt-3 flex items-center space-x-reverse space-x-2">
                          <span className={`text-2xl font-bold ${
                            selectedFeature === index ? 'text-white' : 'text-blue-600'
                          }`}>
                            {feature.stats.value}
                          </span>
                          <span className={`text-xs ${
                            selectedFeature === index 
                              ? 'text-white/70' 
                              : theme === 'dark' 
                              ? 'text-gray-500' 
                              : 'text-gray-500'
                          }`}>
                            {feature.stats.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  {selectedFeature === index && (
                    <div className="mt-4 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '100%' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-2">
            <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700/50'
                : 'bg-white/70 border-gray-200/50'
            } backdrop-blur-sm border shadow-2xl`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedFeatureData.color} opacity-5`} />
              
              <div className="relative z-10 p-8 lg:p-12">
                {/* Feature Header */}
                <div className="flex items-start space-x-reverse space-x-6 mb-8">
                  <div className={`p-6 rounded-3xl bg-gradient-to-r ${selectedFeatureData.color} shadow-xl transform hover:scale-110 transition-transform duration-300`}>
                    <selectedFeatureData.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-3xl lg:text-4xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedFeatureData.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {selectedFeatureData.description}
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                {selectedFeatureData.stats && (
                  <div className={`mb-8 p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
                  }`}>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r ${selectedFeatureData.color} bg-clip-text text-transparent`}>
                          {selectedFeatureData.stats.value}
                        </div>
                        <div className={`text-lg font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {selectedFeatureData.stats.label}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits List */}
                <div className="mb-8">
                  <h4 className={`text-xl font-bold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    المميزات الرئيسية:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFeatureData.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-reverse space-x-3 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedFeatureData.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className={`flex-1 bg-gradient-to-r ${selectedFeatureData.color} text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3`}>
                    <span>جرب الآن</span>
                    <Rocket className="h-5 w-5" />
                  </button>
                  <button className={`flex-1 border-2 px-6 py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <span>تعرف أكثر</span>
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Animated Elements */}
              <div className="absolute top-6 left-6 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-6 right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>

        {/* Interactive Features Showcase */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={feature.id}
              className={`relative group p-8 rounded-3xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-700/50'
                  : 'bg-white/30 border-gray-200/30 hover:bg-white/50'
              } backdrop-blur-sm border hover:shadow-2xl`}
              onClick={() => setSelectedFeature(index)}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>

              <p className={`text-sm leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description.substring(0, 120)}...
              </p>

              {/* Stats */}
              {feature.stats && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.stats.value}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {feature.stats.label}
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 group-hover:translate-x-2 transition-transform ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </div>
              )}

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;

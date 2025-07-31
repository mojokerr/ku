import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shield, CheckCircle, CreditCard, MessageCircle, Star, ArrowLeft, 
  Clock, Users, Award, Zap, Globe, TrendingUp, Lock, Heart, 
  Sparkles, Phone, Mail, MapPin, Menu, X, Rocket, Target, Play,
  ChevronDown, CheckSquare, Eye, Download, Instagram, Twitter, Linkedin, Youtube
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useCustomization } from '../context/CustomizationContext';
import { useTranslation } from '../utils/translations';
import OrderModal from './OrderModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ServicesShowcase from './ServicesShowcase';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import CounterAnimation from './CounterAnimation';

const LandingPage: React.FC = () => {
  // Hooks
  const { services, paymentMethods, siteSettings, loading, error, refreshData } = useData();
  const { theme, language } = useTheme();
  const { customization } = useCustomization();
  const { t } = useTranslation(language);

  // State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);

  // Memoized data
  const activeServices = useMemo(() => 
    services.filter(service => service.active).sort((a, b) => a.order - b.order),
    [services]
  );

  const activePaymentMethods = useMemo(() => 
    paymentMethods.filter(method => method.active),
    [paymentMethods]
  );

  const featuredServices = useMemo(() => 
    activeServices.slice(0, 6),
    [activeServices]
  );

  // Enhanced testimonials data
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مدير أعمال',
      avatar: '👨‍💼',
      rating: 5,
      comment: 'خدمة ممتازة وسريعة، تم إنجاز طلبي في أقل من 5 دقائق. أنصح بشدة بالتعامل مع KYCtrust.',
      date: '2024-11-15',
      verified: true
    },
    {
      id: 2,
      name: 'فاطمة السالم',
      role: 'مؤسسة شركة',
      avatar: '👩‍💼',
      rating: 5,
      comment: 'أفضل منصة للخدمات المالية، دعم فني ممتاز وأسعار مناسبة جداً.',
      date: '2024-11-10',
      verified: true
    },
    {
      id: 3,
      name: 'خالد العلي',
      role: 'طالب جامعي',
      avatar: '👨‍🎓',
      rating: 5,
      comment: 'سهولة في الاستخدام وأمان عالي، تعاملت معهم عدة مرات ولم أواجه أي مشكلة.',
      date: '2024-11-08',
      verified: true
    },
    {
      id: 4,
      name: 'مريم أحمد',
      role: 'ربة منزل',
      avatar: '👩‍🏫',
      rating: 4,
      comment: 'خدمة موثوقة وسعار معقولة، الدعم الفني يرد بسرعة.',
      date: '2024-11-05',
      verified: true
    }
  ], []);

  // Enhanced stats data
  const stats = useMemo(() => [
    { 
      value: 15000, 
      label: t('satisfied_customers'),
      icon: Users,
      prefix: '+',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      value: 99.9, 
      label: t('success_rate'),
      icon: Target,
      suffix: '%',
      color: 'from-green-500 to-green-600'
    },
    { 
      value: 24, 
      label: t('support_hours'),
      icon: Clock,
      suffix: '/7',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      value: 5, 
      label: t('avg_completion_time'),
      icon: Zap,
      suffix: ' دقائق',
      color: 'from-orange-500 to-orange-600'
    }
  ], [t]);

  // Enhanced features data
  const features = useMemo(() => [
    {
      icon: Shield,
      title: t('security_title'),
      description: t('security_desc'),
      color: 'from-blue-500 to-blue-600',
      benefits: ['تشفير من الدرجة البنكية', 'حماية البيانات الشخصية', 'مراقبة أمنية 24/7']
    },
    {
      icon: Zap,
      title: t('speed_title'),
      description: t('speed_desc'),
      color: 'from-yellow-500 to-yellow-600',
      benefits: ['إنجاز فوري للطلبات', 'معالجة سريعة للدفعات', 'دعم فني فوري']
    },
    {
      icon: Award,
      title: t('reliability_title'),
      description: t('reliability_desc'),
      color: 'from-green-500 to-green-600',
      benefits: ['ضمان على جميع الخدمات', 'فريق دعم محترف', 'خبرة أكثر من 5 سنوات']
    },
    {
      icon: Globe,
      title: t('global_reach'),
      description: t('global_reach_desc'),
      color: 'from-purple-500 to-purple-600',
      benefits: ['دعم متعدد القارات', 'عملات متنوعة', 'شراكات عالمية']
    }
  ], [t]);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'services', 'features', 'testimonials', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Handle service order
  const handleOrderService = useCallback((serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setIsNewsletterSubmitted(false), 3000);
    }
  }, [newsletterEmail]);

  // Loading and error states
  if (loading) {
    return <LoadingSpinner size="lg" text={t('loading')} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  const heroData = customization?.hero || {
    title: t('hero_title'),
    titleGradient: t('hero_title_gradient'),
    subtitle: t('hero_subtitle'),
    button1Text: t('get_started'),
    button2Text: t('explore_services'),
    badgeText: t('hero_badge'),
    showStats: true,
    statsData: {
      clients: '15000+',
      successRate: '99.9%',
      support: '24/7',
      speed: '< 5 دقائق'
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 100 
          ? `backdrop-blur-md border-b ${theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  KYCtrust
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('trusted_platform')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-8">
              {[
                { id: 'home', label: t('home') },
                { id: 'services', label: t('services') },
                { id: 'features', label: t('features') },
                { id: 'testimonials', label: t('testimonials') },
                { id: 'contact', label: t('contact') }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-600'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-reverse space-x-4">
              <ThemeToggle />
              <LanguageToggle />
              
              {/* CTA Button */}
              <button
                onClick={() => scrollToSection('services')}
                className="hidden lg:flex items-center space-x-reverse space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Rocket className="h-4 w-4" />
                <span>{t('start_now')}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border-gray-700 backdrop-blur-md' 
              : 'bg-white/95 border-gray-200 backdrop-blur-md'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {[
                { id: 'home', label: t('home') },
                { id: 'services', label: t('services') },
                { id: 'features', label: t('features') },
                { id: 'testimonials', label: t('testimonials') },
                { id: 'contact', label: t('contact') }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-right py-3 px-4 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => scrollToSection('services')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-reverse space-x-2"
              >
                <Rocket className="h-4 w-4" />
                <span>{t('start_now')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900/20' 
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
          }`} />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right space-y-8">
              {/* Badge */}
              <div className={`inline-flex items-center px-6 py-3 backdrop-blur-sm border rounded-full font-semibold ${
                theme === 'dark' 
                  ? 'bg-gray-800/80 border-blue-500/50 text-blue-300' 
                  : 'bg-white/80 border-blue-200/50 text-blue-700'
              }`}>
                <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                <span>{heroData.badgeText}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="block">{heroData.title}</span>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {heroData.titleGradient}
                  </span>
                </h1>
                
                <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {heroData.subtitle}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('services')}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3"
                >
                  <span>{heroData.button1Text}</span>
                  <ArrowLeft className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className={`group backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg border hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 ${
                    theme === 'dark' 
                      ? 'bg-gray-800/80 text-gray-200 border-gray-600/50 hover:bg-gray-700/80' 
                      : 'bg-white/80 text-gray-700 border-gray-200/50 hover:bg-gray-50/80'
                  }`}
                >
                  <span>{heroData.button2Text}</span>
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(65 + i - 1)}
                      </div>
                    ))}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-semibold">15,000+</span> عميل راضٍ
                  </div>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className={`text-sm font-semibold ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    4.9/5
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              {/* Dashboard Preview */}
              <div className={`relative p-8 rounded-3xl shadow-2xl backdrop-blur-sm border transform hover:scale-105 transition-all duration-500 ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700/50' 
                  : 'bg-white/50 border-gray-200/50'
              }`}>
                {/* Mini Dashboard */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          لوحة التحكم
                        </h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          إدارة شاملة
                        </p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 4).map((stat, index) => (
                      <div key={index} className={`p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'
                      }`}>
                        <div className="flex items-center space-x-reverse space-x-2 mb-2">
                          <stat.icon className="h-4 w-4 text-blue-600" />
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stat.label}
                          </span>
                        </div>
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          <CounterAnimation
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/30'
                  }`}>
                    <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      النشاط الأخير
                    </h4>
                    <div className="space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center space-x-reverse space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            طلب جديد تم إنجازه بنجاح
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {i}م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Action Button */}
                <div className="absolute -bottom-4 -right-4">
                  <button className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                    <CheckCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-bounce" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-bounce delay-1000" />
            </div>
          </div>

          {/* Enhanced Stats Row */}
          {heroData.showStats && (
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: heroData.statsData.clients, label: 'عميل راضٍ', icon: Users },
                { value: heroData.statsData.successRate, label: 'معدل النجاح', icon: Target },
                { value: heroData.statsData.support, label: 'دعم متواصل', icon: Clock },
                { value: heroData.statsData.speed, label: 'سرعة التنفيذ', icon: Zap }
              ].map((stat, index) => (
                <div key={index} className={`text-center p-6 rounded-2xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/30 border-gray-700/30' 
                    : 'bg-white/30 border-gray-200/30'
                }`}>
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('services')}
            className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800/50 text-gray-400 hover:text-white' 
                : 'bg-white/50 text-gray-600 hover:text-gray-900'
            } backdrop-blur-sm border border-gray-200/30 hover:border-gray-300/50 transition-all duration-300`}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
              <CreditCard className="h-4 w-4 text-blue-600 ml-2" />
              <span className="text-blue-600 font-medium text-sm">{t('our_services')}</span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              خدمات <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مالية شاملة
              </span>
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              نقدم مجموعة واسعة من الخدمات المالية الرقمية بأعلى معايير الجودة والأمان
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredServices.map((service, index) => (
              <div
                key={service.id}
                className={`group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50' 
                    : 'bg-white/50 border-gray-200/50 hover:border-blue-300/50'
                } backdrop-blur-sm`}
                onClick={() => handleOrderService(service.name)}
              >
                {/* Service Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Service Content */}
                <div className="space-y-4">
                  <h3 className={`text-xl font-bold group-hover:text-blue-600 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {service.description || 'خدمة مالية موثوقة وآمنة بأفضل الأسعار'}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ${service.price}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        / خدمة
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-reverse space-x-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-4">
                    {['تنفيذ فوري', 'أمان عالي', 'دعم 24/7'].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-reverse space-x-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* View All Services Button */}
          <div className="text-center">
            <button
              onClick={() => setIsServicesOpen(true)}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 mx-auto"
            >
              <span>عرض جميع الخدمات</span>
              <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-purple-600 ml-2" />
              <span className="text-purple-600 font-medium text-sm">مميزاتنا</span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              لماذا <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                نحن الأفضل؟
              </span>
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              نجمع بين الأمان والسرعة والموثوقية لنقدم لك أفضل تجربة في الخدمات المالية
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-3xl border transition-all duration-500 hover:shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800/30 border-gray-700/30' 
                    : 'bg-white/30 border-gray-200/30'
                } backdrop-blur-sm`}
              >
                {/* Feature Icon */}
                <div className="flex items-start space-x-reverse space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed mb-6 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-reverse space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mb-6">
              <Heart className="h-4 w-4 text-green-600 ml-2" />
              <span className="text-green-600 font-medium text-sm">آراء العملاء</span>
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ماذا يقول <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                عملاؤنا؟
              </span>
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              تجارب حقيقية من عملائنا الكرام حول جودة خدماتنا
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`group p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-white/50 border-gray-200/50'
                } backdrop-blur-sm relative`}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-20">
                  <MessageCircle className="h-12 w-12 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-reverse space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className={`text-lg leading-relaxed mb-6 relative z-10 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/20">
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(testimonial.date).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-sm border border-gray-200/30 mb-6`}>
              <div className="flex -space-x-2 ml-4">
                {testimonials.slice(0, 3).map((t, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                    {t.avatar}
                  </div>
                ))}
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                انضم إلى +15,000 عميل راضٍ
              </span>
            </div>
            
            <button
              onClick={() => scrollToSection('services')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              ابدأ تجربتك الآن
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
                <Phone className="h-4 w-4 text-blue-600 ml-2" />
                <span className="text-blue-600 font-medium text-sm">تواصل معنا</span>
              </div>
              
              <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                نحن هنا <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  لمساعدتك
                </span>
              </h2>
              
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                فريق الدعم متاح 24/7 لمساعدتك في أي استفسار أو مشكلة
              </p>

              {/* Contact Methods */}
              <div className="space-y-6 mb-8">
                {[
                  { icon: Phone, label: 'هاتف', value: '+966 50 123 4567', action: 'tel:+966501234567' },
                  { icon: Mail, label: 'بريد إلكتروني', value: 'support@kyctrust.com', action: 'mailto:support@kyctrust.com' },
                  { icon: MessageCircle, label: 'تليجرام', value: '@kyctrust_support', action: 'https://t.me/kyctrust_support' },
                  { icon: MapPin, label: 'العنوان', value: 'الرياض، المملكة العربية السعودية', action: '#' }
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={contact.action}
                    className={`flex items-center space-x-reverse space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                        : 'bg-gray-50/50 hover:bg-gray-100/50'
                    } backdrop-blur-sm group`}
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                      <contact.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {contact.label}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {contact.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  تابعنا على
                </h4>
                <div className="flex space-x-reverse space-x-4">
                  {[
                    { icon: Instagram, color: 'from-pink-500 to-purple-500' },
                    { icon: Twitter, color: 'from-blue-400 to-blue-600' },
                    { icon: Linkedin, color: 'from-blue-600 to-blue-800' },
                    { icon: Youtube, color: 'from-red-500 to-red-600' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`p-3 bg-gradient-to-r ${social.color} rounded-xl text-white hover:scale-110 transition-transform duration-300`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className={`p-8 rounded-3xl border ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/50 border-gray-200/50'
            } backdrop-blur-sm`}>
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  اشترك في النشرة الإخبارية
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  احصل على أحدث العروض والتحديثات
                </p>
              </div>

              {isNewsletterSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    شكراً لك!
                  </h4>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    تم تسجيل اشتراكك بنجاح
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className={`w-full px-4 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    اشتراك
                  </button>
                  
                  <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    بالاشتراك، أنت توافق على سياسة الخصوصية الخاصة بنا
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-16 border-t ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-reverse space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    KYCtrust
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    منصة الخدمات المالية الموثوقة
                  </p>
                </div>
              </div>
              
              <p className={`text-sm leading-relaxed mb-6 max-w-md ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                نحن نقدم خدمات مالية رقمية آمنة وموثوقة مع أعلى معايير الجودة والحماية لعملائنا الكرام.
              </p>
              
              <div className="flex space-x-reverse space-x-4">
                {activePaymentMethods.slice(0, 4).map((method, index) => (
                  <div
                    key={method.id}
                    className={`w-12 h-8 rounded flex items-center justify-center text-xs font-bold ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                    } border border-gray-200 dark:border-gray-700`}
                  >
                    {method.name.substring(0, 3).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                روابط سريعة
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'الخدمات', action: () => scrollToSection('services') },
                  { label: 'المميزات', action: () => scrollToSection('features') },
                  { label: 'آراء العملاء', action: () => scrollToSection('testimonials') },
                  { label: 'تواصل معنا', action: () => scrollToSection('contact') },
                  { label: 'لوحة التحكم', action: () => window.open('/admin', '_blank') }
                ].map((link, index) => (
                  <button
                    key={index}
                    onClick={link.action}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className={`font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                معلومات التواصل
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    +966 50 123 4567
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    support@kyctrust.com
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    24/7 دعم فني
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 KYCtrust. جميع الحقوق محفوظة.
            </div>
            
            <div className="flex items-center space-x-reverse space-x-6 text-sm">
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                سياسة الخصوصية
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                شروط الاستخدام
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                المساعدة
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isModalOpen && selectedService && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          serviceName={selectedService}
        />
      )}

      {isServicesOpen && (
        <ServicesShowcase
          isOpen={isServicesOpen}
          onClose={() => setIsServicesOpen(false)}
          onSelectService={handleOrderService}
        />
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>فيديو تعريفي بالمنصة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => scrollToSection('contact')}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Back to Top Button */}
      {scrollY > 500 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:text-white' 
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChevronDown className="h-5 w-5 transform rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

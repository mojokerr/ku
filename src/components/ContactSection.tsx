import React, { useState, useCallback } from 'react';
import { 
  Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle,
  Instagram, Twitter, Linkedin, Youtube, Globe, Headphones,
  Calendar, Video, FileText, Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className = '' }) => {
  const { theme, language } = useTheme();
  const { t } = useTranslation(language);

  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      serviceType: ''
    });

    setTimeout(() => setIsSubmitted(false), 5000);
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsNewsletterSubmitted(true);
    setNewsletterEmail('');
    setTimeout(() => setIsNewsletterSubmitted(false), 3000);
  }, [newsletterEmail]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <section id="contact" className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-6">
            <Headphones className="h-4 w-4 text-blue-600 ml-2" />
            <span className="text-blue-600 font-medium text-sm">تواصل معنا</span>
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            نحن هنا <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              لمساعدتك
            </span>
          </h2>
          
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            فريق الدعم المتخصص متاح 24/7 لمساعدتك في أي استفسار أو مشكلة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className={`p-8 rounded-3xl backdrop-blur-sm border ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700/50'
                : 'bg-white/50 border-gray-200/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-8 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                معلومات التواصل
              </h3>

              {/* Contact Methods */}
              <div className="space-y-6">
                {[
                  { 
                    icon: Phone, 
                    title: 'هاتف مباشر', 
                    value: '+966 50 123 4567', 
                    action: 'tel:+966501234567',
                    available: 'متاح 24/7',
                    color: 'from-green-500 to-emerald-500'
                  },
                  { 
                    icon: Mail, 
                    title: 'بريد إلكتروني', 
                    value: 'support@kyctrust.com', 
                    action: 'mailto:support@kyctrust.com',
                    available: 'رد خلال ساعة',
                    color: 'from-blue-500 to-indigo-500'
                  },
                  { 
                    icon: MessageCircle, 
                    title: 'واتساب', 
                    value: '+966 50 123 4567', 
                    action: 'https://wa.me/966501234567',
                    available: 'متاح 24/7',
                    color: 'from-green-500 to-green-600'
                  },
                  { 
                    icon: Globe, 
                    title: 'تليجرام', 
                    value: '@kyctrust_support', 
                    action: 'https://t.me/kyctrust_support',
                    available: 'دعم فوري',
                    color: 'from-blue-400 to-blue-600'
                  }
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={contact.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-6 rounded-2xl transition-all duration-300 hover:scale-105 group ${
                      theme === 'dark' 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'bg-gray-50/50 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className="flex items-start space-x-reverse space-x-4">
                      <div className={`p-3 bg-gradient-to-r ${contact.color} rounded-xl group-hover:scale-110 transition-transform`}>
                        <contact.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {contact.title}
                        </h4>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {contact.value}
                        </p>
                        <p className="text-xs text-green-500 font-medium">
                          {contact.available}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Office Hours */}
              <div className={`mt-8 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50/50'
              }`}>
                <div className="flex items-center space-x-reverse space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ساعات العمل
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>الأحد - الخميس</span>
                    <span className="font-medium text-blue-600">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>الجمعة - السبت</span>
                    <span className="font-medium text-blue-600">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>دعم طوارئ</span>
                    <span className="font-medium text-green-600">متاح دائماً</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  تابعنا على
                </h4>
                <div className="flex space-x-reverse space-x-4">
                  {[
                    { icon: Instagram, color: 'from-pink-500 to-purple-500', url: '#' },
                    { icon: Twitter, color: 'from-blue-400 to-blue-600', url: '#' },
                    { icon: Linkedin, color: 'from-blue-600 to-blue-800', url: '#' },
                    { icon: Youtube, color: 'from-red-500 to-red-600', url: '#' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`p-3 bg-gradient-to-r ${social.color} rounded-xl text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className={`p-8 rounded-3xl backdrop-blur-sm border ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700/50'
                : 'bg-white/50 border-gray-200/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                أرسل لنا رسالة
              </h3>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    شكراً لتواصلك معنا!
                  </h4>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="+966 50 123 4567"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        نوع الخدمة
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">اختر نوع الخدمة</option>
                        <option value="general">استفسار عام</option>
                        <option value="support">دعم فني</option>
                        <option value="sales">المبيعات</option>
                        <option value="complaint">شكوى</option>
                        <option value="suggestion">اقتراح</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      موضوع الرسالة *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="موضوع رسالتك"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      الرسالة *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>إرسال الرسالة</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Newsletter */}
            <div className={`p-8 rounded-3xl backdrop-blur-sm border ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-gray-800/50 to-blue-900/20 border-gray-700/50'
                : 'bg-gradient-to-r from-white/50 to-blue-50/50 border-gray-200/50'
            }`}>
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  اشترك في النشرة الإخبارية
                </h3>
                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  احصل على أحدث العروض والأخبار والتحديثات مباشرة في بريدك الإلكتروني
                </p>

                {isNewsletterSubmitted ? (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      تم الاشتراك بنجاح!
                    </h4>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      شكراً لك، ستصلك آخر التحديثات قريباً
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className={`flex-1 px-6 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>اشتراك</span>
                    </button>
                  </form>
                )}

                <p className={`text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  بالاشتراك، أنت توافق على سياسة الخصوصية الخاصة بنا. يمكنك إلغاء الاشتراك في أي وقت.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'حجز موعد', color: 'from-blue-500 to-indigo-500' },
                { icon: Video, label: 'مكالمة فيديو', color: 'from-green-500 to-emerald-500' },
                { icon: FileText, label: 'دليل المستخدم', color: 'from-purple-500 to-violet-500' },
                { icon: Download, label: 'تحميل التطبيق', color: 'from-orange-500 to-red-500' }
              ].map((item, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-xl bg-gradient-to-r ${item.color} text-white font-medium hover:scale-105 transition-transform duration-300 flex flex-col items-center space-y-2`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

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

        <div className="text-center">
          {/* Contact Info */}
          <div className={`max-w-4xl mx-auto p-12 rounded-3xl backdrop-blur-sm border ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-white/50 border-gray-200/50'
          }`}>
            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 p-4 bg-gradient-to-r ${contact.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                      <contact.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {contact.title}
                    </h4>
                    <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {contact.value}
                    </p>
                    <p className="text-xs text-green-500 font-medium">
                      {contact.available}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Office Hours */}
            <div className={`mb-8 p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50/50'
            }`}>
              <div className="flex items-center justify-center space-x-reverse space-x-3 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ساعات العمل
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <span className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>الأحد - الخميس</span>
                  <span className="block font-medium text-blue-600 text-lg">24/7</span>
                </div>
                <div className="text-center">
                  <span className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>الجمعة - السبت</span>
                  <span className="block font-medium text-blue-600 text-lg">24/7</span>
                </div>
                <div className="text-center">
                  <span className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>دعم طوارئ</span>
                  <span className="block font-medium text-green-600 text-lg">متاح دائماً</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                تابعنا على وسائل التواصل
              </h4>
              <div className="flex justify-center space-x-reverse space-x-6">
                {[
                  { icon: Instagram, color: 'from-pink-500 to-purple-500', url: '#', name: 'Instagram' },
                  { icon: Twitter, color: 'from-blue-400 to-blue-600', url: '#', name: 'Twitter' },
                  { icon: Linkedin, color: 'from-blue-600 to-blue-800', url: '#', name: 'LinkedIn' },
                  { icon: Youtube, color: 'from-red-500 to-red-600', url: '#', name: 'YouTube' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 bg-gradient-to-r ${social.color} rounded-xl text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl group`}
                    title={social.name}
                  >
                    <social.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

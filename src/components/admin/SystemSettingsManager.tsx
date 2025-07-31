import React, { useState, useEffect } from 'react';
import { 
  Save, Globe, FileText, Bell, Palette, Shield, Users, Eye, EyeOff,
  Zap, Target, Clock, Upload, Download, RefreshCw, Settings, Lock,
  Key, RotateCcw, Smartphone, Monitor, Tablet, Languages, Sliders,
  Image, CheckCircle, AlertTriangle, Info, HelpCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

interface SystemSettings {
  site: {
    title: string;
    subtitle: string;
    description: string;
    keywords: string;
    logo: string;
    favicon: string;
    language: string;
    direction: 'rtl' | 'ltr';
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoText: string;
    tagline: string;
    brandName: string;
  };
  features: {
    darkMode: boolean;
    languageSwitch: boolean;
    animations: boolean;
    notifications: boolean;
    analytics: boolean;
    userProfiles: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordExpiry: number;
    ipWhitelist: string[];
    backupFrequency: string;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    lazyLoading: boolean;
    cdnEnabled: boolean;
    imageOptimization: boolean;
  };
  content: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
    orderNotice: string;
    contactEmail: string;
    contactPhone: string;
    socialLinks: {
      twitter: string;
      facebook: string;
      linkedin: string;
      instagram: string;
    };
  };
}

const SystemSettingsManager: React.FC = () => {
  const { theme } = useTheme();
  const { siteSettings, updateSiteSettings, loading, error, refreshData } = useData();
  const [activeTab, setActiveTab] = useState<'site' | 'branding' | 'features' | 'security' | 'performance' | 'content'>('site');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [settings, setSettings] = useState<SystemSettings>({
    site: {
      title: siteSettings.title || 'KYCtrust',
      subtitle: 'منصة موثوقة',
      description: siteSettings.description || 'منصة رائدة في الخدمات المالية الرقمية',
      keywords: 'خدمات مالية, تقنية, أمان, موثوقية',
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      language: 'ar',
      direction: 'rtl'
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      accentColor: '#059669',
      logoText: 'KYCtrust',
      tagline: 'منصة موثوقة',
      brandName: 'KYCtrust'
    },
    features: {
      darkMode: true,
      languageSwitch: true,
      animations: true,
      notifications: true,
      analytics: true,
      userProfiles: false
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90,
      ipWhitelist: [],
      backupFrequency: 'daily'
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      lazyLoading: true,
      cdnEnabled: false,
      imageOptimization: true
    },
    content: {
      heroTitle: 'مستقبل الخدمات المالية الرقمية',
      heroSubtitle: 'نحن نعيد تعريف الخدمات المالية الرقمية',
      heroDescription: 'من خلال تقديم حلول مبتكرة وآمنة ومتطورة تلبي احتياجاتك المالية بكفاءة عالية وموثوقية استثنائية',
      ctaPrimary: 'ابدأ رحلتك معنا',
      ctaSecondary: 'استكشف خدماتنا',
      orderNotice: siteSettings.orderNotice || 'سيتم الرد عليك في أقرب وقت ممكن',
      contactEmail: 'info@kyctrust.com',
      contactPhone: '+966500000000',
      socialLinks: {
        twitter: '',
        facebook: '',
        linkedin: '',
        instagram: ''
      }
    }
  });

  const tabs = [
    { id: 'site' as const, name: 'إعدادات الموقع', icon: Globe },
    { id: 'branding' as const, name: 'الهوية البصرية', icon: Palette },
    { id: 'features' as const, name: 'المميزات', icon: Zap },
    { id: 'security' as const, name: 'الأمان', icon: Shield },
    { id: 'performance' as const, name: 'الأداء', icon: Target },
    { id: 'content' as const, name: 'المحتوى', icon: FileText }
  ];

  const handleSettingChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section: keyof SystemSettings, nested: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...(prev[section] as any)[nested],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // تحديث إعدادات الموقع الأساسية
      await updateSiteSettings({
        title: settings.site.title,
        description: settings.site.description,
        orderNotice: settings.content.orderNotice
      });
      
      // حفظ باقي الإعدادات في localStorage للتجربة
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      setHasChanges(false);
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      // إعادة تعيين إلى القيم الافتراضية
      setSettings({
        site: {
          title: 'KYCtrust',
          subtitle: 'منصة موثوقة',
          description: 'منصة رائدة في الخدمات المالية الرقمية',
          keywords: 'خدمات مالية, تقنية, أمان, موثوقية',
          logo: '/logo.svg',
          favicon: '/favicon.ico',
          language: 'ar',
          direction: 'rtl'
        },
        branding: {
          primaryColor: '#2563eb',
          secondaryColor: '#7c3aed',
          accentColor: '#059669',
          logoText: 'KYCtrust',
          tagline: 'منصة موثوقة',
          brandName: 'KYCtrust'
        },
        features: {
          darkMode: true,
          languageSwitch: true,
          animations: true,
          notifications: true,
          analytics: true,
          userProfiles: false
        },
        security: {
          enableTwoFactor: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordExpiry: 90,
          ipWhitelist: [],
          backupFrequency: 'daily'
        },
        performance: {
          cacheEnabled: true,
          compressionEnabled: true,
          lazyLoading: true,
          cdnEnabled: false,
          imageOptimization: true
        },
        content: {
          heroTitle: 'مستقبل الخدمات المالية الرقمية',
          heroSubtitle: 'نحن نعيد تعريف الخدمات المالية الرقمية',
          heroDescription: 'من خلال تقديم حلول مبتكرة وآمنة ومتطورة تلبي احتياجاتك المالية بكفاءة عالية وموثوقية استثنائية',
          ctaPrimary: 'ابدأ رحلتك معنا',
          ctaSecondary: 'استكشف خدماتنا',
          orderNotice: 'سيتم الرد عليك في أقرب وقت ممكن',
          contactEmail: 'info@kyctrust.com',
          contactPhone: '+966500000000',
          socialLinks: {
            twitter: '',
            facebook: '',
            linkedin: '',
            instagram: ''
          }
        }
      });
      setHasChanges(true);
    }
  };

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل إعدادات النظام..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  const renderSiteSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عنوان الموقع
          </label>
          <input
            type="text"
            value={settings.site.title}
            onChange={(e) => handleSettingChange('site', 'title', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="عنوان الموقع الرئيسي"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العنوان الفرعي
          </label>
          <input
            type="text"
            value={settings.site.subtitle}
            onChange={(e) => handleSettingChange('site', 'subtitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="العنوان الفرعي"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          وصف الموقع
        </label>
        <textarea
          value={settings.site.description}
          onChange={(e) => handleSettingChange('site', 'description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none dark:bg-gray-700 dark:text-white"
          placeholder="وصف شامل للموقع"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الكلمات المفتاحية
          </label>
          <input
            type="text"
            value={settings.site.keywords}
            onChange={(e) => handleSettingChange('site', 'keywords', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="كلمات مفتاحية مفصولة بفواصل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اللغة الافتراضية
          </label>
          <select
            value={settings.site.language}
            onChange={(e) => handleSettingChange('site', 'language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اللون الأساسي
          </label>
          <div className="flex items-center space-x-reverse space-x-3">
            <input
              type="color"
              value={settings.branding.primaryColor}
              onChange={(e) => handleSettingChange('branding', 'primaryColor', e.target.value)}
              className="w-12 h-12 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={settings.branding.primaryColor}
              onChange={(e) => handleSettingChange('branding', 'primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اللون الثانوي
          </label>
          <div className="flex items-center space-x-reverse space-x-3">
            <input
              type="color"
              value={settings.branding.secondaryColor}
              onChange={(e) => handleSettingChange('branding', 'secondaryColor', e.target.value)}
              className="w-12 h-12 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={settings.branding.secondaryColor}
              onChange={(e) => handleSettingChange('branding', 'secondaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            لون التمييز
          </label>
          <div className="flex items-center space-x-reverse space-x-3">
            <input
              type="color"
              value={settings.branding.accentColor}
              onChange={(e) => handleSettingChange('branding', 'accentColor', e.target.value)}
              className="w-12 h-12 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={settings.branding.accentColor}
              onChange={(e) => handleSettingChange('branding', 'accentColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نص الشعار
          </label>
          <input
            type="text"
            value={settings.branding.logoText}
            onChange={(e) => handleSettingChange('branding', 'logoText', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="نص الشعار"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الشعار التعريفي
          </label>
          <input
            type="text"
            value={settings.branding.tagline}
            onChange={(e) => handleSettingChange('branding', 'tagline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="شعار تعريفي قصير"
          />
        </div>
      </div>

      {/* معاينة الألوان */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">معاينة الألوان</h3>
        <div className="grid grid-cols-3 gap-4">
          <div 
            className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: settings.branding.primaryColor }}
          >
            أساسي
          </div>
          <div 
            className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: settings.branding.secondaryColor }}
          >
            ثانوي
          </div>
          <div 
            className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: settings.branding.accentColor }}
          >
            تمييز
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(settings.features).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {key === 'darkMode' && 'الوضع الليلي'}
                {key === 'languageSwitch' && 'تبديل اللغة'}
                {key === 'animations' && 'الحركات والانتقالات'}
                {key === 'notifications' && 'الإشعارات'}
                {key === 'analytics' && 'التحليلات'}
                {key === 'userProfiles' && 'ملفات المستخدمين'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {key === 'darkMode' && 'تفعيل الوضع الليلي للموقع'}
                {key === 'languageSwitch' && 'إمكانية تبديل اللغة'}
                {key === 'animations' && 'عرض الحركات والانتقالات'}
                {key === 'notifications' && 'نظام الإشعارات'}
                {key === 'analytics' && 'تتبع وتحليل الزيارات'}
                {key === 'userProfiles' && 'ملفات تعريف للمستخدمين'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange('features', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
        <div className="flex items-start space-x-reverse space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">تنبيه أمان</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              تغيير إعدادات الأمان قد يؤثر على عمل النظام. تأكد من فهمك لكل إعداد قبل تفعيله.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">المصادقة الثنائية</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">تفعيل المصادقة بخطوتين</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            انتهاء الجلسة (بالدقائق)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            min="5"
            max="1440"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            محاولات تسجيل الدخول القصوى
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            min="3"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تكرار النسخ الاحتياطي
          </label>
          <select
            value={settings.security.backupFrequency}
            onChange={(e) => handleSettingChange('security', 'backupFrequency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
          >
            <option value="hourly">كل ساعة</option>
            <option value="daily">يومياً</option>
            <option value="weekly">أسبوعياً</option>
            <option value="monthly">شهرياً</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(settings.performance).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {key === 'cacheEnabled' && 'تفعيل التخزين المؤقت'}
                {key === 'compressionEnabled' && 'ضغط الملفات'}
                {key === 'lazyLoading' && 'التحميل التدريجي'}
                {key === 'cdnEnabled' && 'شبكة توصيل المحتوى'}
                {key === 'imageOptimization' && 'تحسين الصور'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {key === 'cacheEnabled' && 'حفظ البيانات مؤقتاً لتسريع التحميل'}
                {key === 'compressionEnabled' && 'ضغط الملفات لتوفير مساحة'}
                {key === 'lazyLoading' && 'تحميل المحتوى عند الحاجة فقط'}
                {key === 'cdnEnabled' && 'استخدام CDN لتوزيع المحتوى'}
                {key === 'imageOptimization' && 'تحسين جودة وحجم الصور'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleSettingChange('performance', key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          العنوان الرئيسي للصفحة
        </label>
        <input
          type="text"
          value={settings.content.heroTitle}
          onChange={(e) => handleSettingChange('content', 'heroTitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
          placeholder="العنوان الرئيسي"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          العنوان الفرعي
        </label>
        <input
          type="text"
          value={settings.content.heroSubtitle}
          onChange={(e) => handleSettingChange('content', 'heroSubtitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
          placeholder="العنوان الفرعي"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          وصف الصفحة الرئيسية
        </label>
        <textarea
          value={settings.content.heroDescription}
          onChange={(e) => handleSettingChange('content', 'heroDescription', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none dark:bg-gray-700 dark:text-white"
          placeholder="وصف شامل للخدمات"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            زر الإجراء الأساسي
          </label>
          <input
            type="text"
            value={settings.content.ctaPrimary}
            onChange={(e) => handleSettingChange('content', 'ctaPrimary', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="نص الزر الأساسي"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            زر الإجراء الثانوي
          </label>
          <input
            type="text"
            value={settings.content.ctaSecondary}
            onChange={(e) => handleSettingChange('content', 'ctaSecondary', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="نص الزر الثانوي"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تنبيه الطلبات
        </label>
        <textarea
          value={settings.content.orderNotice}
          onChange={(e) => handleSettingChange('content', 'orderNotice', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none dark:bg-gray-700 dark:text-white"
          placeholder="رسالة تظهر للعملاء بعد إرسال الطلب"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            البريد الإلكتروني للتواصل
          </label>
          <input
            type="email"
            value={settings.content.contactEmail}
            onChange={(e) => handleSettingChange('content', 'contactEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="info@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم الهاتف للتواصل
          </label>
          <input
            type="tel"
            value={settings.content.contactPhone}
            onChange={(e) => handleSettingChange('content', 'contactPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
            placeholder="+966500000000"
          />
        </div>
      </div>

      {/* روابط وسائل التواصل الاجتماعي */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">روابط وسائل التواصل الاجتماعي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.content.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {platform === 'twitter' && 'تويتر'}
                {platform === 'facebook' && 'فيسبوك'}
                {platform === 'linkedin' && 'لينكد إن'}
                {platform === 'instagram' && 'إنستجرام'}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleNestedChange('content', 'socialLinks', platform, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
                placeholder={`رابط ${platform === 'twitter' ? 'تويتر' : platform === 'facebook' ? 'فيسبوك' : platform === 'linkedin' ? 'لينكد إن' : 'إنستجرام'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات النظام</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">تحكم شامل في جميع إعدادات الموقع والنظام</p>
        </div>
        
        <div className="flex items-center space-x-reverse space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-reverse space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>{showAdvanced ? 'إخفاء المتقدم' : 'عرض المتقدم'}</span>
          </button>
          
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-reverse space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-reverse space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-reverse space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          {activeTab === 'site' && renderSiteSettings()}
          {activeTab === 'branding' && renderBrandingSettings()}
          {activeTab === 'features' && renderFeaturesSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'performance' && renderPerformanceSettings()}
          {activeTab === 'content' && renderContentSettings()}
        </div>

        {/* Save Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-100 dark:border-gray-600 flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-3">
            {hasChanges && (
              <div className="flex items-center space-x-reverse space-x-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">يوجد تغييرات غير محفوظة</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-reverse space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center space-x-reverse space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {activeTab === 'content' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">معاينة المحتوى</h2>
            <div className="flex items-center space-x-reverse space-x-2">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded-lg ${previewMode === 'tablet' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${
            previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
            previewMode === 'tablet' ? 'max-w-2xl mx-auto' : 
            'w-full'
          }`}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {settings.content.heroTitle}
            </h1>
            <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {settings.content.heroSubtitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {settings.content.heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button 
                className="px-6 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: settings.branding.primaryColor }}
              >
                {settings.content.ctaPrimary}
              </button>
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300">
                {settings.content.ctaSecondary}
              </button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>تنبيه:</strong> {settings.content.orderNotice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettingsManager;

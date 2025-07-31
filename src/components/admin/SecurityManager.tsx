import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Key, Eye, EyeOff, RefreshCw, AlertTriangle, 
  CheckCircle, Clock, Users, Activity, Database, FileText,
  Settings, RotateCcw, Save, Download, Upload, Zap, Bell
} from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

interface SecuritySettings {
  password: {
    current: string;
    new: string;
    confirm: string;
    strength: number;
    requirements: {
      minLength: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    };
  };
  twoFactor: {
    enabled: boolean;
    secret: string;
    backupCodes: string[];
  };
  session: {
    timeout: number;
    maxSessions: number;
    requirePasswordForSensitive: boolean;
  };
  access: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    ipWhitelist: string[];
    allowedCountries: string[];
  };
  audit: {
    logLogin: boolean;
    logActions: boolean;
    logExports: boolean;
    retentionDays: number;
  };
}

interface LoginAttempt {
  id: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  location?: string;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  ip: string;
  success: boolean;
}

const SecurityManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'password' | 'twoFactor' | 'session' | 'access' | 'audit'>('password');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SecuritySettings>({
    password: {
      current: '',
      new: '',
      confirm: '',
      strength: 0,
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false
      }
    },
    twoFactor: {
      enabled: false,
      secret: '',
      backupCodes: []
    },
    session: {
      timeout: 30,
      maxSessions: 3,
      requirePasswordForSensitive: true
    },
    access: {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: [],
      allowedCountries: ['SA', 'AE', 'EG', 'US']
    },
    audit: {
      logLogin: true,
      logActions: true,
      logExports: true,
      retentionDays: 90
    }
  });

  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([
    {
      id: '1',
      ip: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      success: true,
      location: 'الرياض, السعودية'
    },
    {
      id: '2',
      ip: '10.0.0.50',
      userAgent: 'Firefox 119.0',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      success: false,
      location: 'دبي, الإمارات'
    },
    {
      id: '3',
      ip: '203.0.113.0',
      userAgent: 'Safari 17.0',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      success: true,
      location: 'القاهرة, مصر'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'تغيير كلمة المرور',
      details: 'تم تغيير كلمة المرور بنجاح',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      ip: '192.168.1.100',
      success: true
    },
    {
      id: '2',
      action: 'تصدير البيانات',
      details: 'تصدير قائمة الطلبات بصيغة CSV',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ip: '192.168.1.100',
      success: true
    },
    {
      id: '3',
      action: 'محاولة دخول فاشلة',
      details: 'كلمة مرور خاطئة',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ip: '10.0.0.50',
      success: false
    }
  ]);

  const tabs = [
    { id: 'password' as const, name: 'كلمة المرور', icon: Key },
    { id: 'twoFactor' as const, name: 'المصادقة الثنائية', icon: Shield },
    { id: 'session' as const, name: 'الجلسات', icon: Clock },
    { id: 'access' as const, name: 'التحكم في الوصول', icon: Lock },
    { id: 'audit' as const, name: 'سجل الأنشطة', icon: FileText }
  ];

  // تحليل قوة كلمة المرور
  const analyzePasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const strength = Math.min(100, (score / 5) * 100);

    setSettings(prev => ({
      ...prev,
      password: {
        ...prev.password,
        new: password,
        strength,
        requirements
      }
    }));
  };

  // تغيير كلمة المرور
  const handlePasswordChange = async () => {
    if (!settings.password.current) {
      setError('يرجى إدخال كلمة المرور الحالية');
      return;
    }

    if (settings.password.new !== settings.password.confirm) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقتان');
      return;
    }

    if (settings.password.strength < 60) {
      setError('كلمة المرور ضعيفة جداً، يرجى اختيار كلمة مرور أقوى');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // حفظ كلمة المرور الجديد�� (مشفرة)
      const hashedPassword = btoa(settings.password.new); // تشفير بسيط للعرض
      localStorage.setItem('adminPasswordHash', hashedPassword);
      
      // مسح الحقول
      setSettings(prev => ({
        ...prev,
        password: {
          ...prev.password,
          current: '',
          new: '',
          confirm: '',
          strength: 0,
          requirements: {
            minLength: false,
            hasUppercase: false,
            hasLowercase: false,
            hasNumbers: false,
            hasSpecialChars: false
          }
        }
      }));

      // إضافة سجل للنشاط
      const newLog: AuditLog = {
        id: Date.now().toString(),
        action: 'تغيير كلمة المرور',
        details: 'تم تغيير كلمة المرور بنجاح',
        timestamp: new Date(),
        ip: '192.168.1.100',
        success: true
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setSuccess('تم تغيير كلمة المرور بنجاح');
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (error) {
      setError('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setSaving(false);
    }
  };

  // تفعيل المصادقة الثنائ��ة
  const generateTwoFactorSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    setSettings(prev => ({
      ...prev,
      twoFactor: {
        ...prev.twoFactor,
        secret,
        backupCodes
      }
    }));
  };

  // تصدير سجل الأنشطة
  const exportAuditLog = () => {
    const csvContent = [
      ['التاريخ', 'النشاط', 'التفاصيل', 'عنوان IP', 'النتيجة'],
      ...auditLogs.map(log => [
        log.timestamp.toLocaleString('ar-SA'),
        log.action,
        log.details,
        log.ip,
        log.success ? 'نجح' : 'فشل'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return 'ضعيفة جداً';
    if (strength < 60) return 'ضعيفة';
    if (strength < 80) return 'متوسطة';
    return 'قوية';
  };

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, []);

  const renderPasswordTab = () => (
    <div className="space-y-6">
      {/* تنبيه الأمان */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
        <div className="flex items-start space-x-reverse space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">تنبيه أمان مهم</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              تأكد من اختيار كلمة مرور قوية ولا تشاركها مع أي شخص. احفظ كلمة المرور في مكان آمن.
            </p>
          </div>
        </div>
      </div>

      {/* تغيير كلمة المرور */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">تغيير كلمة المرور</h3>
        
        <div className="space-y-4">
          {/* كلمة المرور الحالية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={settings.password.current}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  password: { ...prev.password, current: e.target.value }
                }))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
                placeholder="أدخل كلمة المرور الحالية"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* كلمة المرور الجديدة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={settings.password.new}
                onChange={(e) => analyzePasswordStrength(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
                placeholder="أدخل كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* مؤشر قوة كلمة المرور */}
            {settings.password.new && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">قوة كلمة المرور:</span>
                  <span className={`font-medium ${
                    settings.password.strength < 30 ? 'text-red-600' :
                    settings.password.strength < 60 ? 'text-yellow-600' :
                    settings.password.strength < 80 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText(settings.password.strength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(settings.password.strength)}`}
                    style={{ width: `${settings.password.strength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={settings.password.confirm}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  password: { ...prev.password, confirm: e.target.value }
                }))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white"
                placeholder="أعد إدخال كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* التحقق من التطابق */}
            {settings.password.confirm && (
              <div className="mt-2">
                {settings.password.new === settings.password.confirm ? (
                  <div className="flex items-center space-x-reverse space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">كلمات المرور متطابقة</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-reverse space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">كلمات المرور غير متطابقة</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* متطلبات كلمة المرور */}
          {settings.password.new && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">متطلبات كلمة المرور:</h4>
              <div className="space-y-2">
                {Object.entries({
                  minLength: 'على الأقل 8 أحرف',
                  hasUppercase: 'حرف كبير واحد على الأقل',
                  hasLowercase: 'حرف صغير واحد على الأقل',
                  hasNumbers: 'رقم واحد على الأقل',
                  hasSpecialChars: 'رمز خاص واحد على الأقل'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-reverse space-x-2">
                    {settings.password.requirements[key as keyof typeof settings.password.requirements] ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 border border-gray-300 rounded-full" />
                    )}
                    <span className={`text-sm ${
                      settings.password.requirements[key as keyof typeof settings.password.requirements] 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* أزرار الحفظ */}
          <div className="flex items-center justify-end space-x-reverse space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setSettings(prev => ({
                ...prev,
                password: {
                  current: '',
                  new: '',
                  confirm: '',
                  strength: 0,
                  requirements: {
                    minLength: false,
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumbers: false,
                    hasSpecialChars: false
                  }
                }
              }))}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              onClick={handlePasswordChange}
              disabled={saving || !settings.password.current || !settings.password.new || !settings.password.confirm || settings.password.new !== settings.password.confirm}
              className="flex items-center space-x-reverse space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTwoFactorTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المصادقة الثنائية</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              إضافة طبقة حماية إضافية لحسابك
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactor.enabled}
              onChange={(e) => {
                if (e.target.checked && !settings.twoFactor.secret) {
                  generateTwoFactorSecret();
                }
                setSettings(prev => ({
                  ...prev,
                  twoFactor: { ...prev.twoFactor, enabled: e.target.checked }
                }));
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.twoFactor.enabled && (
          <div className="space-y-4">
            {/* QR Code والمفتاح السري */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">إعداد التطبيق</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                استخدم تطبيق المصادقة مثل Google Authenticator أو Authy لمسح الرمز أو إدخال المفتاح السري:
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-center mb-4">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المفتاح السري:
                  </label>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <input
                      type="text"
                      value={settings.twoFactor.secret}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(settings.twoFactor.secret)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* رموز الاسترداد */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">رموز الاسترداد</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                احفظ هذه الرموز في مكان آمن. يمكنك استخدامها للدخول إذا فقدت جهازك:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {settings.twoFactor.backupCodes.map((code, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-center font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => {
                  const codesText = settings.twoFactor.backupCodes.join('\n');
                  const blob = new Blob([codesText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'backup-codes.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center space-x-reverse space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>تنزيل الرموز</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-center space-x-reverse space-x-3">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{loginAttempts.length}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">محاولات الدخول</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-center space-x-reverse space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                {loginAttempts.filter(a => a.success).length}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">دخول ناجح</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
          <div className="flex items-center space-x-reverse space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                {loginAttempts.filter(a => !a.success).length}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">محاولات فاشلة</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
          <div className="flex items-center space-x-reverse space-x-3">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">{auditLogs.length}</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">سجلات الأنشطة</p>
            </div>
          </div>
        </div>
      </div>

      {/* محاولات تسجيل الدخول */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">محاولات تسجيل الدخول الأخيرة</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loginAttempts.map((attempt) => (
            <div key={attempt.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`w-3 h-3 rounded-full ${attempt.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {attempt.success ? 'دخول ناجح' : 'محاولة دخول فاشلة'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attempt.ip} • {attempt.userAgent} • {attempt.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {attempt.timestamp.toLocaleString('ar-SA')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* سجل الأنشطة */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">سجل الأنشطة</h3>
          <button
            onClick={exportAuditLog}
            className="flex items-center space-x-reverse space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>تصدير السجل</span>
          </button>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`w-3 h-3 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {log.details} • {log.ip}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {log.timestamp.toLocaleString('ar-SA')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل إعدادات الأمان..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الأمان</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">تحكم في إعدادات الأمان وكلمات المرور</p>
        </div>
      </div>

      {/* رسائل التنبيه */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
          <div className="flex items-start space-x-reverse space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-start space-x-reverse space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

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
      {activeTab === 'password' && renderPasswordTab()}
      {activeTab === 'twoFactor' && renderTwoFactorTab()}
      {activeTab === 'audit' && renderAuditTab()}
    </div>
  );
};

export default SecurityManager;

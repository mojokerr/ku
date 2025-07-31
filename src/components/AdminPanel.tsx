import React, { useState, useEffect } from 'react';
import { 
  Shield, Settings, Package, CreditCard, Inbox, Eye, EyeOff, Palette, Layout,
  BarChart3, Users, FileText, Bell, Search, Filter, Moon, Sun, Globe, 
  Activity, TrendingUp, Calendar, Download, RefreshCw, Home, LogOut, Menu, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LoginForm from './admin/LoginForm';
import Dashboard from './admin/Dashboard';
import ServicesManager from './admin/ServicesManager';
import PaymentMethodsManager from './admin/PaymentMethodsManager';
import OrdersManager from './admin/OrdersManager';
import SiteSettingsManager from './admin/SiteSettingsManager';
import LandingPageCustomizer from './admin/LandingPageCustomizer';
import LiveLandingPageEditor from './admin/LiveLandingPageEditor';
import AnalyticsPanel from './admin/AnalyticsPanel';
import ReportsManager from './admin/ReportsManager';
import UsersManager from './admin/UsersManager';
import BackupManager from './admin/BackupManager';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useData } from '../context/DataContext';

type TabType = 'dashboard' | 'services' | 'payments' | 'orders' | 'settings' | 'customize' | 'live-editor' | 'analytics' | 'reports' | 'users' | 'backup';

const AdminPanel: React.FC = () => {
  const { theme } = useTheme();
  const { orders, services, refreshData } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleRefresh = async () => {
    await refreshData();
    setLastRefresh(new Date());
  };

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Real-time notifications
  useEffect(() => {
    const newOrdersCount = orders.filter(order => !order.archived).length;
    setNotifications(newOrdersCount);
  }, [orders]);

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard' as TabType, name: 'لوحة التحكم', icon: Shield, category: 'main' },
    { id: 'analytics' as TabType, name: 'التحليلات', icon: BarChart3, category: 'main' },
    { id: 'live-editor' as TabType, name: 'المحرر المباشر', icon: Layout, category: 'content' },
    { id: 'services' as TabType, name: 'إدارة الخدمات', icon: Package, category: 'content' },
    { id: 'orders' as TabType, name: 'الطلبات', icon: Inbox, category: 'operations', badge: orders.filter(o => !o.archived).length },
    { id: 'users' as TabType, name: 'إدارة المستخدمين', icon: Users, category: 'operations' },
    { id: 'payments' as TabType, name: 'طرق الدفع', icon: CreditCard, category: 'operations' },
    { id: 'reports' as TabType, name: 'التقارير', icon: FileText, category: 'analytics' },
    { id: 'customize' as TabType, name: 'تخصيص الصفحة', icon: Palette, category: 'settings' },
    { id: 'backup' as TabType, name: 'النسخ الاحتياطي', icon: Download, category: 'settings' },
    { id: 'settings' as TabType, name: 'إعدادات الموقع', icon: Settings, category: 'settings' },
  ];

  const tabCategories = {
    main: 'الرئيسية',
    content: 'المحتوى',
    operations: 'العمليات',
    analytics: 'التحليلات',
    settings: 'الإعدادات'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'live-editor':
        return <LiveLandingPageEditor />;
      case 'services':
        return <ServicesManager />;
      case 'payments':
        return <PaymentMethodsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'users':
        return <UsersManager />;
      case 'reports':
        return <ReportsManager />;
      case 'backup':
        return <BackupManager />;
      case 'customize':
        return <LandingPageCustomizer />;
      case 'settings':
        return <SiteSettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  const filteredTabs = tabs.filter(tab => 
    tab.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTabs = filteredTabs.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, typeof tabs>);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-50 shadow-lg border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/95 border-gray-700 backdrop-blur-md'
          : 'bg-white/95 border-gray-200 backdrop-blur-md'
      }`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-reverse space-x-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`hidden lg:flex p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    KYCtrust Admin
                  </h1>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    مركز إدارة النظام
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="البحث في لوحة التحكم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full pr-10 pl-3 py-2 border rounded-xl text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-reverse space-x-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="تحديث البيا��ات"
              >
                <RefreshCw className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className={`relative p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Home Link */}
              <a
                href="/"
                target="_blank"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="زيارة الموقع الرئيسي"
              >
                <Home className="h-5 w-5" />
              </a>

              <ThemeToggle />
              <LanguageToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`hidden lg:flex items-center space-x-reverse space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                    : 'text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Last Refresh Indicator */}
        <div className={`px-4 py-1 text-xs border-t ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          آخر تحديث: {lastRefresh.toLocaleTimeString('ar-EG')}
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Enhanced Sidebar */}
        <aside className={`fixed lg:static inset-y-0 right-0 z-40 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
        } ${
          isMobileMenuOpen ? 'w-80' : 'w-0 lg:w-80'
        } ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border-l border-gray-200 dark:border-gray-700 shadow-xl lg:shadow-none overflow-hidden`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between">
                  <h2 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    القائمة الرئيسية
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`lg:hidden p-1 rounded-lg ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              {isSidebarCollapsed ? (
                <ul className="space-y-2">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 group relative ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={tab.name}
                      >
                        <tab.icon className="h-5 w-5" />
                        {tab.badge && (
                          <span className="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {tab.badge > 9 ? '9+' : tab.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
                    <div key={category}>
                      <h3 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {tabCategories[category as keyof typeof tabCategories]}
                      </h3>
                      <ul className="space-y-1">
                        {categoryTabs.map((tab) => (
                          <li key={tab.id}>
                            <button
                              onClick={() => {
                                setActiveTab(tab.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center space-x-reverse space-x-3 px-4 py-3 rounded-xl text-right transition-all duration-300 group ${
                                activeTab === tab.id
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                  : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <div className="relative">
                                <tab.icon className="h-5 w-5" />
                                {tab.badge && (
                                  <span className="absolute -top-2 -left-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                    {tab.badge > 9 ? '9+' : tab.badge}
                                  </span>
                                )}
                              </div>
                              <span className="font-medium flex-1">{tab.name}</span>
                              {activeTab === tab.id && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </nav>

            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        النظام متصل
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        جمي�� الخدمات تعمل بشكل طبيعي
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-80'
        }`}>
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

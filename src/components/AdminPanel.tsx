import React, { useState } from 'react';
import { Shield, Settings, Package, CreditCard, Inbox, Eye, EyeOff, Palette, Layout } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LoginForm from './admin/LoginForm';
import Dashboard from './admin/Dashboard';
import ServicesManager from './admin/ServicesManager';
import PaymentMethodsManager from './admin/PaymentMethodsManager';
import OrdersManager from './admin/OrdersManager';
import SiteSettingsManager from './admin/SiteSettingsManager';
import LandingPageCustomizer from './admin/LandingPageCustomizer';
import LiveLandingPageEditor from './admin/LiveLandingPageEditor';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

type TabType = 'dashboard' | 'services' | 'payments' | 'orders' | 'settings' | 'customize' | 'live-editor';

const AdminPanel: React.FC = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard' as TabType, name: 'لوحة التحكم', icon: Shield },
    { id: 'services' as TabType, name: 'إدارة الخدمات', icon: Package },
    { id: 'payments' as TabType, name: 'طرق الدفع', icon: CreditCard },
    { id: 'orders' as TabType, name: 'الطلبات', icon: Inbox },
    { id: 'customize' as TabType, name: 'تخصيص صفحة الهبوط', icon: Palette },
    { id: 'settings' as TabType, name: 'إعدادات الموقع', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServicesManager />;
      case 'payments':
        return <PaymentMethodsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'customize':
        return <LandingPageCustomizer />;
      case 'settings':
        return <SiteSettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                لوحة تحكم KYCtrust
              </h1>
            </div>

            <div className="flex items-center space-x-reverse space-x-4">
              <ThemeToggle />
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className={`rounded-xl shadow-sm p-4 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-reverse space-x-3 px-4 py-3 rounded-lg text-right transition-colors ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-blue-900/50 text-blue-300 border-l-4 border-blue-500'
                            : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

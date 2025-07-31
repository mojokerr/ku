import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity, Target, Zap, 
  Award, Eye, ArrowUp, ArrowDown, Percent, Clock, Globe, Filter, Download,
  PieChart, LineChart, RefreshCw, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsData {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  customerGrowth: number;
  popularServices: Array<{
    name: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
    newCustomers: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  performanceMetrics: {
    avgResponseTime: number;
    successRate: number;
    customerSatisfaction: number;
    systemUptime: number;
  };
}

const AdvancedAnalytics: React.FC = () => {
  const { theme } = useTheme();
  const { orders, services, paymentMethods } = useData();
  
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('orders');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate analytics data
  const analyticsData = useMemo<AnalyticsData>(() => {
    const now = new Date();
    const rangeInDays = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - rangeInDays * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= startDate;
    });

    const totalOrders = filteredOrders.length;
    const activeOrders = filteredOrders.filter(order => !order.archived).length;
    const completedOrders = filteredOrders.filter(order => order.archived).length;
    
    // Calculate revenue (assuming average price of $25 per order)
    const totalRevenue = filteredOrders.length * 25;
    const avgOrderValue = totalRevenue / Math.max(totalOrders, 1);
    
    // Popular services analysis
    const serviceStats = services.map(service => {
      const serviceOrders = filteredOrders.filter(order => order.serviceName === service.name);
      const revenue = serviceOrders.length * parseFloat(service.price.toString() || '25');
      
      // Calculate growth (mock data for demo)
      const prevPeriodOrders = Math.floor(serviceOrders.length * (0.8 + Math.random() * 0.4));
      const growth = prevPeriodOrders > 0 ? ((serviceOrders.length - prevPeriodOrders) / prevPeriodOrders) * 100 : 0;
      
      return {
        name: service.name,
        orders: serviceOrders.length,
        revenue,
        growth
      };
    }).sort((a, b) => b.orders - a.orders);

    // Daily stats for the last 7 days
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.length * 25,
        newCustomers: Math.floor(dayOrders.length * 0.7) // Mock new customers
      };
    }).reverse();

    // Monthly trends (last 6 months)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const prevMonthOrders = Math.floor(monthOrders.length * (0.8 + Math.random() * 0.4));
      const growth = prevMonthOrders > 0 ? ((monthOrders.length - prevMonthOrders) / prevMonthOrders) * 100 : 0;
      
      return {
        month: date.toLocaleDateString('ar-EG', { month: 'short' }),
        orders: monthOrders.length,
        revenue: monthOrders.length * 25,
        growth
      };
    }).reverse();

    return {
      totalOrders,
      activeOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      conversionRate: 87.5, // Mock conversion rate
      customerGrowth: 15.3, // Mock customer growth
      popularServices: serviceStats.slice(0, 5),
      dailyStats,
      monthlyTrends,
      performanceMetrics: {
        avgResponseTime: 2.3, // seconds
        successRate: 99.2, // percentage
        customerSatisfaction: 4.8, // out of 5
        systemUptime: 99.9 // percentage
      }
    };
  }, [orders, services, dateRange]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    const csvData = [
      ['تاريخ', 'الطلبات', 'الإيرادات', 'عملاء جدد'],
      ...analyticsData.dailyStats.map(stat => [
        stat.date,
        stat.orders.toString(),
        stat.revenue.toString(),
        stat.newCustomers.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            التحليلات المتقدمة
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            تحليل شامل ومفصل لأداء المنصة والخدمات
          </p>
        </div>
        
        <div className="flex items-center space-x-reverse space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-xl transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر 30 يوم</option>
            <option value="90days">آخر 90 يوم</option>
          </select>
          
          <button
            onClick={exportData}
            className={`p-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="تصدير البيانات"
          >
            <Download className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`p-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="تحديث البيانات"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {analyticsData.totalOrders.toLocaleString()}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الطلبات
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              +{analyticsData.customerGrowth}%
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              مقارنة بالفترة السابقة
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${analyticsData.totalRevenue.toLocaleString()}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الإيرادات
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              +22.5%
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              نمو الإيرادات
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {analyticsData.conversionRate}%
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                معدل التحويل
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              +3.2%
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              تحسن الأداء
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${analyticsData.avgOrderValue.toFixed(2)}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                متوسط قيمة الطلب
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              +8.1%
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              زيادة المتوسط
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          مؤشرات الأداء الرئيسية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${analyticsData.performanceMetrics.successRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analyticsData.performanceMetrics.successRate}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-reverse space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                معدل النجاح
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              نسبة الطلبات المكتملة بنجاح
            </p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-8`}>
                  {analyticsData.performanceMetrics.avgResponseTime}s
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-reverse space-x-2 mb-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                زمن الاستجابة
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              متوسط زمن معالجة الطلبات
            </p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-8`}>
                  {analyticsData.performanceMetrics.customerSatisfaction}/5
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-reverse space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                رضا العملاء
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              تقييم متوسط رضا العملاء
            </p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray={`${analyticsData.performanceMetrics.systemUptime}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analyticsData.performanceMetrics.systemUptime}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-reverse space-x-2 mb-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                وقت التشغيل
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              نسبة توفر النظام
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Chart */}
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              الأداء اليومي
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className={`px-3 py-1 text-sm border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="orders">الطلبات</option>
              <option value="revenue">الإيرادات</option>
              <option value="customers">العملاء الجدد</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {analyticsData.dailyStats.map((day, index) => {
              const value = selectedMetric === 'orders' ? day.orders : 
                           selectedMetric === 'revenue' ? day.revenue : day.newCustomers;
              const maxValue = Math.max(...analyticsData.dailyStats.map(d => 
                selectedMetric === 'orders' ? d.orders : 
                selectedMetric === 'revenue' ? d.revenue : d.newCustomers
              ));
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {day.date}
                  </span>
                  <div className="flex items-center space-x-reverse space-x-3 flex-1 mx-4">
                    <div className={`flex-1 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} w-12 text-right`}>
                      {selectedMetric === 'revenue' ? `$${value}` : value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Services */}
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            أفضل الخدمات أداءً
          </h3>
          
          <div className="space-y-4">
            {analyticsData.popularServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {service.name}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {service.orders} طلب
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    ${service.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-reverse space-x-1">
                    {service.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      service.growth >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {Math.abs(service.growth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          الاتجاهات الشهرية
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-right py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  الشهر
                </th>
                <th className={`text-right py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  الطلبات
                </th>
                <th className={`text-right py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  الإيرادات
                </th>
                <th className={`text-right py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  النمو
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.monthlyTrends.map((month, index) => (
                <tr key={index} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {month.month}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {month.orders.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    ${month.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      {month.growth >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`font-semibold ${
                        month.growth >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(month.growth).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;

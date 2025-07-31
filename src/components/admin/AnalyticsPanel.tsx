import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity, Target, Zap, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AnalyticsPanel: React.FC = () => {
  const { services, orders } = useData();

  // حساب الإحصائيات
  const totalOrders = orders.length;
  const activeOrders = orders.filter(order => !order.archived).length;
  const archivedOrders = orders.filter(order => order.archived).length;
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.timestamp);
    return orderDate.toDateString() === today.toDateString();
  }).length;

  // أكثر الخدمات طلباً
  const serviceStats = services.map(service => {
    const orderCount = orders.filter(order => order.serviceName === service.name).length;
    const percentage = totalOrders > 0 ? ((orderCount / totalOrders) * 100).toFixed(1) : 0;
    return { name: service.name, count: orderCount, percentage };
  }).sort((a, b) => b.count - a.count);

  // إحصائيات الطلبات حسب الأسبوع الماضي
  const weeklyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate.toDateString() === date.toDateString();
    }).length;
    return {
      day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
      orders: dayOrders
    };
  }).reverse();

  // معدل النمو الأسبوعي
  const lastWeekOrders = orders.filter(order => {
    const twoWeeksAgo = new Date();
    const oneWeekAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const orderDate = new Date(order.timestamp);
    return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo;
  }).length;

  const thisWeekOrders = orders.filter(order => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(order.timestamp) >= oneWeekAgo;
  }).length;

  const growthRate = lastWeekOrders > 0 ? (((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
        <p className="text-gray-600 mt-1">تحليل شامل لأداء الموقع والخدمات</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-gray-500">إجمالي الطلبات</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{activeOrders}</p>
              <p className="text-sm text-gray-500">طلبات نشطة</p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-1 text-xs">
            <span className={`font-medium ${parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
            </span>
            <span className="text-gray-500">من الأسبوع الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{todayOrders}</p>
              <p className="text-sm text-gray-500">طلبات اليوم</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((todayOrders / Math.max(totalOrders, 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{archivedOrders}</p>
              <p className="text-sm text-gray-500">طلبات مكتملة</p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-1 text-xs text-green-600">
            <Award className="h-3 w-3" />
            <span>معدل إنجاز {totalOrders > 0 ? ((archivedOrders / totalOrders) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">معدل الإنجاز</h3>
              <p className="text-3xl font-bold text-blue-700">
                {totalOrders > 0 ? ((archivedOrders / totalOrders) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-600">من إجمالي الطلبات المستلمة</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">النمو الأسبوعي</h3>
              <p className={`text-3xl font-bold ${parseFloat(growthRate) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
              </p>
            </div>
          </div>
          <p className="text-sm text-green-600">مقارنة بالأسبوع الماضي</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">متوسط يومي</h3>
              <p className="text-3xl font-bold text-purple-700">
                {(totalOrders / Math.max(1, Math.ceil((Date.now() - new Date(orders[orders.length - 1]?.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1)}
              </p>
            </div>
          </div>
          <p className="text-sm text-purple-600">طلب في اليوم</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الطلبات خلال الأسبوع الماضي</h3>
          <div className="space-y-3">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.day}</span>
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.max((stat.orders / Math.max(...weeklyStats.map(s => s.orders))) * 100, 5)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{stat.orders}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أكثر الخدمات طلباً</h3>
          <div className="space-y-3">
            {serviceStats.slice(0, 8).map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{service.name}</span>
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.max((service.count / Math.max(...serviceStats.map(s => s.count))) * 100, 5)}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{service.count}</span>
                    <span className="text-xs text-gray-500 block">({service.percentage}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center space-x-reverse space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  طلب جديد من {order.customerName}
                </p>
                <p className="text-xs text-gray-500">
                  {order.serviceName} - {new Date(order.timestamp).toLocaleDateString('ar-EG')}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.archived ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {order.archived ? 'مكتمل' : 'جديد'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
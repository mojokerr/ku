import React from 'react';
import { Package, CreditCard, Inbox, TrendingUp, Users, CheckCircle, Activity, Calendar, BarChart3 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const Dashboard: React.FC = () => {
  const { services, paymentMethods, orders, loading, error, refreshData } = useData();

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل البيانات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  const activeServices = services.filter(service => service.active);
  const activePaymentMethods = paymentMethods.filter(method => method.active);
  const activeOrders = orders.filter(order => !order.archived);
  const archivedOrders = orders.filter(order => order.archived);

  // إحصائيات إضافية
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.timestamp);
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekOrders = orders.filter(order => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(order.timestamp) >= weekAgo;
  }).length;
  const stats = [
    {
      title: 'الخدمات النشطة',
      value: activeServices.length,
      total: services.length,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'طرق الدفع',
      value: activePaymentMethods.length,
      total: paymentMethods.length,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'الطلبات الجديدة',
      value: activeOrders.length,
      total: orders.length,
      icon: Inbox,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'الطلبات المؤرشفة',
      value: archivedOrders.length,
      total: orders.length,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'طلبات اليوم',
      value: todayOrders,
      total: orders.length,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'طلبات الأسبوع',
      value: thisWeekOrders,
      total: orders.length,
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  const recentOrders = orders
    .filter(order => !order.archived)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة تحكم KYCtrust</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">من أصل {stat.total}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-right">{stat.title}</h3>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((stat.value / stat.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">آخر الطلبات</h2>
            <div className="flex items-center space-x-reverse space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">مباشر</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد طلبات جديدة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="flex items-center space-x-reverse space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{order.serviceName}</p>
                    {order.notes && (
                      <p className="text-xs text-gray-500 mt-1">{order.notes}</p>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mb-1">
                      جديد
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.timestamp).toLocaleDateString('ar-EG')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.timestamp).toLocaleTimeString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">إحصائيات سريعة</h3>
          <p className="text-blue-700 text-sm">عرض تفصيلي لأداء الموقع والخدمات</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <Users className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">إدارة العملاء</h3>
          <p className="text-green-700 text-sm">تتبع طلبات العملاء وتفاعلاتهم</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
          <Package className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-purple-900 mb-2">تحديث الخدمات</h3>
          <p className="text-purple-700 text-sm">إضافة وتعديل الخدمات المتاحة</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useMemo } from 'react';
import { 
  Archive, Trash2, Search, Calendar, User, Package, FileText, Filter, Download, 
  Eye, Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, MessageSquare,
  Star, Tag, DollarSign, Activity, TrendingUp, RefreshCw, Edit, Send, Plus,
  SortAsc, SortDesc, MoreHorizontal, Export, Import, Bell, MapPin
} from 'lucide-react';
import { useData, Order } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import toast from 'react-hot-toast';

interface OrderFilters {
  status: 'all' | 'active' | 'completed' | 'pending' | 'cancelled';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  service: string;
  priority: 'all' | 'high' | 'medium' | 'low';
  searchTerm: string;
}

interface OrderStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
  todayOrders: number;
  revenue: number;
  avgOrderValue: number;
  completionRate: number;
}

const AdvancedOrdersManager: React.FC = () => {
  const { theme } = useTheme();
  const { orders, services, archiveOrder, deleteOrder, updateOrder, loading, error, refreshData } = useData();
  
  // State
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    dateRange: 'all',
    service: 'all',
    priority: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'customer' | 'service' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // Enhanced order data with additional fields
  const enhancedOrders = useMemo(() => {
    return orders.map(order => ({
      ...order,
      priority: order.priority || 'medium',
      status: order.archived ? 'completed' : 'pending',
      estimatedCompletion: new Date(new Date(order.timestamp).getTime() + 5 * 60 * 1000), // 5 minutes
      customerEmail: `${order.customerName.toLowerCase().replace(' ', '.')}@example.com`,
      customerPhone: '+966 5' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
      orderValue: Math.floor(Math.random() * 100) + 20, // Random value between 20-120
      location: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'][Math.floor(Math.random() * 5)]
    }));
  }, [orders]);

  // Calculate order statistics
  const orderStats = useMemo<OrderStats>(() => {
    const total = enhancedOrders.length;
    const active = enhancedOrders.filter(order => !order.archived).length;
    const completed = enhancedOrders.filter(order => order.archived).length;
    const pending = active; // All non-archived are pending
    
    const today = new Date().toDateString();
    const todayOrders = enhancedOrders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    ).length;
    
    const revenue = enhancedOrders.reduce((sum, order) => sum + order.orderValue, 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      active,
      completed,
      pending,
      todayOrders,
      revenue,
      avgOrderValue,
      completionRate
    };
  }, [enhancedOrders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = enhancedOrders.filter(order => {
      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'active' && order.archived) return false;
        if (filters.status === 'completed' && !order.archived) return false;
        if (filters.status === 'pending' && order.archived) return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const orderDate = new Date(order.timestamp);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (orderDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (orderDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (orderDate < monthAgo) return false;
            break;
          case 'custom':
            if (customDateRange.start && orderDate < new Date(customDateRange.start)) return false;
            if (customDateRange.end && orderDate > new Date(customDateRange.end)) return false;
            break;
        }
      }

      // Service filter
      if (filters.service !== 'all' && order.serviceName !== filters.service) return false;

      // Priority filter
      if (filters.priority !== 'all' && order.priority !== filters.priority) return false;

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matches = 
          order.customerName.toLowerCase().includes(searchLower) ||
          order.serviceName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower) ||
          (order.notes && order.notes.toLowerCase().includes(searchLower));
        if (!matches) return false;
      }

      return true;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'customer':
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case 'service':
          aValue = a.serviceName;
          bValue = b.serviceName;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedOrders, filters, sortBy, sortOrder, customDateRange]);

  // Handlers
  const handleOrderAction = async (orderId: string, action: string) => {
    const order = enhancedOrders.find(o => o.id === orderId);
    if (!order) return;

    switch (action) {
      case 'complete':
        if (window.confirm(`إكمال طلب "${order.customerName}"؟`)) {
          await archiveOrder(orderId);
          toast.success('تم إكمال الطلب بنجاح');
        }
        break;
      case 'delete':
        if (window.confirm(`حذف طلب "${order.customerName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
          await deleteOrder(orderId);
          toast.success('تم حذف الطلب');
        }
        break;
      case 'priority':
        const newPriority = order.priority === 'high' ? 'medium' : order.priority === 'medium' ? 'low' : 'high';
        await updateOrder(orderId, { priority: newPriority });
        toast.success(`تم تغيير الأولوية إلى ${newPriority === 'high' ? 'عالية' : newPriority === 'medium' ? 'متوسطة' : 'منخفضة'}`);
        break;
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error('يرجى تحديد طلب واحد على الأقل');
      return;
    }

    const confirmMessage = action === 'complete' 
      ? `إكمال ${selectedOrders.length} طلب؟`
      : `حذف ${selectedOrders.length} طلب؟`;

    if (window.confirm(confirmMessage)) {
      try {
        for (const orderId of selectedOrders) {
          if (action === 'complete') {
            await archiveOrder(orderId);
          } else if (action === 'delete') {
            await deleteOrder(orderId);
          }
        }
        setSelectedOrders([]);
        toast.success(`تم ${action === 'complete' ? 'إكمال' : 'حذف'} ${selectedOrders.length} طلب`);
      } catch (error) {
        toast.error('حدث خطأ أثناء تنفيذ العملية');
      }
    }
  };

  const exportOrders = () => {
    const csvData = [
      ['العميل', 'الخدمة', 'التاريخ', 'الحالة', 'القيمة', 'الملاحظات'],
      ...filteredOrders.map(order => [
        order.customerName,
        order.serviceName,
        new Date(order.timestamp).toLocaleDateString('ar-EG'),
        order.archived ? 'مكتمل' : 'معلق',
        order.orderValue.toString(),
        order.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (archived: boolean) => {
    return archived 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل الطلبات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            إدارة الطلبات المتقدمة
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            نظام شامل لإدارة ومتابعة جميع الطلبات والعمليات
          </p>
        </div>
        
        <div className="flex items-center space-x-reverse space-x-3">
          <button
            onClick={() => refreshData()}
            className={`p-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="تحديث البيانات"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          <button
            onClick={exportOrders}
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
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-reverse space-x-2 px-4 py-3 rounded-xl border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300'
                : theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {orderStats.total.toLocaleString()}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الطلبات
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">+12.5%</span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              من الشهر الماضي
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {orderStats.pending.toLocaleString()}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                طلبات معلقة
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-orange-500 font-medium">
              {orderStats.todayOrders} اليوم
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {orderStats.completionRate.toFixed(1)}%
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                معدل الإنجاز
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">
              {orderStats.completed} مكتمل
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${orderStats.revenue.toLocaleString()}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي القيمة
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-500 font-medium">
              ${orderStats.avgOrderValue.toFixed(0)} متوسط
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                حالة الطلب
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="completed">مكتمل</option>
                <option value="active">نشط</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الفترة الزمنية
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">كل الأوقات</option>
                <option value="today">اليوم</option>
                <option value="week">آخر أسبوع</option>
                <option value="month">آخر شهر</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الخدمة
              </label>
              <select
                value={filters.service}
                onChange={(e) => setFilters({...filters, service: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">جميع الخدمات</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>{service.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الأولوية
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value as any})}
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">جميع الأولويات</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="البحث في الطلبات (العميل، الخدمة، البريد الإلكتروني...)"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              className={`w-full pr-10 pl-4 py-3 border rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sorting and Bulk Actions */}
      <div className={`p-4 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-reverse space-x-4">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              ترتيب حسب:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="date">التاريخ</option>
              <option value="customer">اسم العميل</option>
              <option value="service">الخدمة</option>
              <option value="priority">الأولوية</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-reverse space-x-3">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                تم تحديد {selectedOrders.length} طلب
              </span>
              <button
                onClick={() => handleBulkAction('complete')}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                إكمال الكل
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                حذف الكل
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className={`rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              قائمة الطلبات ({filteredOrders.length})
            </h3>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className={`h-16 w-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                لا توجد طلبات تطابق معايير البحث
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    selectedOrders.includes(order.id)
                      ? 'border-blue-300 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-900/20'
                      : theme === 'dark'
                      ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-reverse space-x-4 flex-1">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                          }
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />

                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-reverse space-x-3 mb-2">
                              <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {order.customerName}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                                {order.priority === 'high' ? 'عالية' : order.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.archived)}`}>
                                {order.archived ? 'مكتمل' : 'معلق'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center space-x-reverse space-x-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {order.serviceName}
                                </span>
                              </div>

                              <div className="flex items-center space-x-reverse space-x-2">
                                <Mail className="h-4 w-4 text-green-600" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {order.customerEmail}
                                </span>
                              </div>

                              <div className="flex items-center space-x-reverse space-x-2">
                                <Phone className="h-4 w-4 text-purple-600" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {order.customerPhone}
                                </span>
                              </div>

                              <div className="flex items-center space-x-reverse space-x-2">
                                <MapPin className="h-4 w-4 text-orange-600" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {order.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-reverse space-x-6 mb-3">
                              <div className="flex items-center space-x-reverse space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(order.timestamp).toLocaleDateString('ar-EG')}
                                </span>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(order.timestamp).toLocaleTimeString('ar-EG', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center space-x-reverse space-x-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                  ${order.orderValue}
                                </span>
                              </div>

                              {!order.archived && (
                                <div className="flex items-center space-x-reverse space-x-2">
                                  <Clock className="h-4 w-4 text-orange-500" />
                                  <span className={`text-sm ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                                    متوقع: {order.estimatedCompletion.toLocaleTimeString('ar-EG', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>

                            {order.notes && (
                              <div className={`p-3 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-600/50' : 'bg-gray-100'
                              }`}>
                                <div className="flex items-start space-x-reverse space-x-2">
                                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {order.notes}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-reverse space-x-2 mr-4">
                      <button
                        onClick={() => handleOrderAction(order.id, 'priority')}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-yellow-400 hover:bg-yellow-900/50'
                            : 'text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title="تغيير الأولوية"
                      >
                        <Star className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-blue-400 hover:bg-blue-900/50'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {!order.archived && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'complete')}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'text-green-400 hover:bg-green-900/50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title="إكمال الطلب"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleOrderAction(order.id, 'delete')}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-red-400 hover:bg-red-900/50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title="حذف الطلب"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  تفاصيل الطلب
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    معلومات العميل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        الاسم
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        البريد الإلكتروني
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        رقم الهاتف
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        الموقع
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    تفاصيل الطلب
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        الخدمة
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.serviceName}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        القيمة
                      </label>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        ${selectedOrder.orderValue}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        تاريخ الطلب
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {new Date(selectedOrder.timestamp).toLocaleDateString('ar-EG')} - {new Date(selectedOrder.timestamp).toLocaleTimeString('ar-EG')}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        الحالة
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.archived)}`}>
                        {selectedOrder.archived ? '��كتمل' : 'معلق'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ملاحظات
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                {!selectedOrder.archived && (
                  <button
                    onClick={() => {
                      handleOrderAction(selectedOrder.id, 'complete');
                      setIsModalOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    إكمال الطلب
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`px-6 py-3 border rounded-xl font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedOrdersManager;

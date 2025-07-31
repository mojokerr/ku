import React, { useState } from 'react';
import { Archive, Trash2, Search, Calendar, User, Package, FileText } from 'lucide-react';
import { useData, Order } from '../../context/DataContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const OrdersManager: React.FC = () => {
  const { orders, archiveOrder, deleteOrder, loading, error, refreshData } = useData();
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !order.archived) || 
      (filter === 'archived' && order.archived);

    const matchesSearch = 
      searchTerm === '' ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleArchive = (order: Order) => {
    if (window.confirm(`هل تريد أرشفة طلب "${order.customerName}"؟`)) {
      archiveOrder(order.id);
    }
  };

  const handleDelete = (order: Order) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب "${order.customerName}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      deleteOrder(order.id);
    }
  };

  const activeOrdersCount = orders.filter(order => !order.archived).length;
  const archivedOrdersCount = orders.filter(order => order.archived).length;

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل الطلبات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
        <p className="text-gray-600 mt-1">عرض وإدارة جميع طلبات العملاء</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الطلبات النشطة</p>
              <p className="text-2xl font-bold text-orange-600">{activeOrdersCount}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الطلبات المؤرشفة</p>
              <p className="text-2xl font-bold text-green-600">{archivedOrdersCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Archive className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'الكل', count: orders.length },
              { key: 'active', label: 'النشطة', count: activeOrdersCount },
              { key: 'archived', label: 'المؤرشفة', count: archivedOrdersCount }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طلبات</p>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'لم يتم العثور على طلبات تطابق البحث' : 'لم يتم استلام أي طلبات بعد'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    order.archived
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-reverse space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${order.archived ? 'bg-gray-100' : 'bg-blue-100'}`}>
                          <User className={`h-5 w-5 ${order.archived ? 'text-gray-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.customerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.timestamp).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            <strong>الخدمة:</strong> {order.serviceName}
                          </span>
                        </div>
                        
                        {order.notes && (
                          <div className="flex items-start space-x-reverse space-x-2">
                            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">
                                <strong>ملاحظات:</strong>
                              </p>
                              <p className="text-sm text-gray-600 mt-1 bg-white p-3 rounded-lg">
                                {order.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.archived
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.archived ? 'مؤرشف' : 'جديد'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-reverse space-x-2">
                      {!order.archived && (
                        <button
                          onClick={() => handleArchive(order)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="أرشفة الطلب"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
};

export default OrdersManager;
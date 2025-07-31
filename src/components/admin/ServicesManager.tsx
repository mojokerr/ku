import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Search, Filter, 
  Copy, Star, TrendingUp, DollarSign, Users, BarChart3, Image, Settings,
  Clock, CheckCircle, AlertCircle, Package, Upload, Download, RefreshCw
} from 'lucide-react';
import { useData, Service } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import toast from 'react-hot-toast';

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: string;
  features: string[];
  processingTime: string;
  order: number;
  active: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

const ServicesManager: React.FC = () => {
  const { theme } = useTheme();
  const { services, orders, updateService, addService, deleteService, loading, error, refreshData } = useData();
  
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'order' | 'popularity'>('order');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'financial',
    features: [''],
    processingTime: '5 دقائق',
    order: 1,
    active: true,
    featured: false,
    imageUrl: '',
    tags: []
  });

  // Categories
  const categories = [
    { id: 'financial', name: 'الخدمات المالية', icon: DollarSign, color: 'blue' },
    { id: 'digital', name: 'الخدمات الرقمية', icon: Package, color: 'green' },
    { id: 'premium', name: 'الخدمات المميزة', icon: Star, color: 'gold' },
    { id: 'popular', name: 'الأكثر طلباً', icon: TrendingUp, color: 'purple' }
  ];

  // Service analytics
  const serviceAnalytics = useMemo(() => {
    return services.map(service => {
      const serviceOrders = orders.filter(order => order.serviceName === service.name);
      const completedOrders = serviceOrders.filter(order => order.archived);
      const revenue = serviceOrders.length * parseFloat(service.price.toString() || '0');
      
      return {
        ...service,
        totalOrders: serviceOrders.length,
        completedOrders: completedOrders.length,
        revenue,
        successRate: serviceOrders.length > 0 ? (completedOrders.length / serviceOrders.length) * 100 : 0
      };
    });
  }, [services, orders]);

  // Filtered and sorted services
  const filteredServices = useMemo(() => {
    let filtered = serviceAnalytics.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (service.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && service.active) ||
                           (filterStatus === 'inactive' && !service.active) ||
                           (filterStatus === 'featured' && service.featured);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort services
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        filtered.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      default:
        filtered.sort((a, b) => a.order - b.order);
    }

    return filtered;
  }, [serviceAnalytics, searchQuery, filterCategory, filterStatus, sortBy]);

  // Form handlers
  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'financial',
      features: [''],
      processingTime: '5 دقائق',
      order: services.length + 1,
      active: true,
      featured: false,
      imageUrl: '',
      tags: []
    });
    setEditingService(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      originalPrice: service.originalPrice?.toString() || '',
      category: service.category || 'financial',
      features: service.features || [''],
      processingTime: service.processingTime || '5 دقائق',
      order: service.order,
      active: service.active,
      featured: service.featured || false,
      imageUrl: service.imageUrl || '',
      tags: service.tags || []
    });
    setEditingService(service);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      features: formData.features.filter(f => f.trim() !== ''),
      tags: formData.tags.filter(t => t.trim() !== '')
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
      toast.success('تم تحديث الخدمة بنجاح');
    } else {
      addService(serviceData);
      toast.success('تم إضافة الخدمة بنجاح');
    }
    closeModal();
  };

  const handleBulkAction = (action: string) => {
    if (selectedServices.length === 0) {
      toast.error('يرجى تحديد خدمة واحدة على الأقل');
      return;
    }

    switch (action) {
      case 'activate':
        selectedServices.forEach(id => {
          const service = services.find(s => s.id === id);
          if (service) updateService(id, { active: true });
        });
        toast.success(`تم تفعيل ${selectedServices.length} خدمة`);
        break;
      case 'deactivate':
        selectedServices.forEach(id => {
          const service = services.find(s => s.id === id);
          if (service) updateService(id, { active: false });
        });
        toast.success(`تم إلغاء تفعيل ${selectedServices.length} خدمة`);
        break;
      case 'delete':
        if (window.confirm(`هل أنت متأكد من حذف ${selectedServices.length} خدمة؟`)) {
          selectedServices.forEach(id => deleteService(id));
          toast.success(`تم حذف ${selectedServices.length} خدمة`);
        }
        break;
    }
    setSelectedServices([]);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل الخدمات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            إدارة الخدمات
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            إدارة شاملة للخدمات مع إحصائيات الأداء والتحليلات
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
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-reverse space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة خدمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {services.length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الخدمات
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {services.filter(s => s.active).length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                خدمات نشطة
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {services.filter(s => s.featured).length}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                خدمات مميزة
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {serviceAnalytics.reduce((total, service) => total + service.totalOrders, 0)}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                إجمالي الطلبات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="البحث في الخدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-10 pl-4 py-3 border rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-reverse space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 border rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 border rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="featured">مميز</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-3 border rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="order">ترتيب الظهور</option>
              <option value="name">الاسم</option>
              <option value="price">السعر</option>
              <option value="popularity">الشعبية</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedServices.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                تم تحديد {selectedServices.length} خدمة
              </span>
              <div className="flex items-center space-x-reverse space-x-3">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  تفعيل
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  إلغاء تفعيل
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services List */}
      <div className={`rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  service.active
                    ? theme === 'dark'
                      ? 'border-green-600/50 bg-green-900/20'
                      : 'border-green-200 bg-green-50'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700/50'
                    : 'border-gray-200 bg-gray-50'
                } ${selectedServices.includes(service.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-reverse space-x-4 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices([...selectedServices, service.id]);
                        } else {
                          setSelectedServices(selectedServices.filter(id => id !== service.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    {/* Service Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-reverse space-x-3 mb-2">
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {service.name}
                            </h3>
                            {service.featured && (
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          {service.description && (
                            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {service.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-reverse space-x-4 mb-3">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                ${service.price}
                              </span>
                              {service.originalPrice && (
                                <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  ${service.originalPrice}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {service.processingTime || '5 دقائق'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-reverse space-x-2">
                              <Users className="h-4 w-4 text-purple-600" />
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {service.totalOrders} طلب
                              </span>
                            </div>

                            <div className="flex items-center space-x-reverse space-x-2">
                              <BarChart3 className="h-4 w-4 text-orange-600" />
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {service.successRate.toFixed(1)}% نجاح
                              </span>
                            </div>
                          </div>

                          {/* Features */}
                          {service.features && service.features.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-2">
                                {service.features.slice(0, 3).map((feature, index) => (
                                  <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    theme === 'dark' 
                                      ? 'bg-blue-900/50 text-blue-300' 
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {feature}
                                  </span>
                                ))}
                                {service.features.length > 3 && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    theme === 'dark' 
                                      ? 'bg-gray-700 text-gray-300' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    +{service.features.length - 3} المزيد
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status badges */}
                          <div className="flex items-center space-x-reverse space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.active ? 'نشط' : 'غير نشط'}
                            </span>
                            
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              ترتيب: {service.order}
                            </span>

                            {service.category && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {categories.find(c => c.id === service.category)?.name || service.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Revenue */}
                        <div className="text-left">
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            ${service.revenue}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            إجمالي الإيرادات
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-reverse space-x-2 mr-4">
                    <button
                      onClick={() => {
                        const newOrder = service.order - 1;
                        if (newOrder >= 1) {
                          updateService(service.id, { order: newOrder });
                        }
                      }}
                      disabled={service.order === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        service.order === 1 
                          ? 'opacity-50 cursor-not-allowed' 
                          : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        const newOrder = service.order + 1;
                        updateService(service.id, { order: newOrder });
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => updateService(service.id, { active: !service.active })}
                      className={`p-2 rounded-lg transition-colors ${
                        service.active
                          ? theme === 'dark' 
                            ? 'text-green-400 hover:bg-green-900/50' 
                            : 'text-green-600 hover:bg-green-100'
                          : theme === 'dark'
                          ? 'text-gray-400 hover:bg-gray-700'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => updateService(service.id, { featured: !service.featured })}
                      className={`p-2 rounded-lg transition-colors ${
                        service.featured
                          ? theme === 'dark' 
                            ? 'text-yellow-400 hover:bg-yellow-900/50' 
                            : 'text-yellow-600 hover:bg-yellow-100'
                          : theme === 'dark'
                          ? 'text-gray-400 hover:bg-gray-700'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${service.featured ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => openEditModal(service)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-blue-400 hover:bg-blue-900/50'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف خدمة "${service.name}"؟`)) {
                          deleteService(service.id);
                          toast.success('تم حذف الخدمة بنجاح');
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <Package className={`h-16 w-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  لا توجد خدمات تطابق معايير البحث
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      اسم الخدمة *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="مثل: PayPal"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      الفئة
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    وصف الخدمة
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="وصف مختصر للخدمة..."
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      السعر *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="15.00"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      السعر الأصلي (اختياري)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="20.00"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      وقت التنفيذ
                    </label>
                    <input
                      type="text"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="5 دقائق"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    مميزات الخدمة
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-reverse space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="مميزة الخدمة..."
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-reverse space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>إضافة مميزة</span>
                    </button>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ترتيب الظهور
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      required
                      min="1"
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
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
                      رابط الصورة (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center space-x-reverse space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className={`mr-3 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      خدمة نشطة ومتاحة
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className={`mr-3 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      خدمة مميزة
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingService ? 'تحديث الخدمة' : 'إضافة الخدمة'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-6 py-3 border rounded-xl font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, CreditCard } from 'lucide-react';
import { useData, PaymentMethod } from '../../context/DataContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const PaymentMethodsManager: React.FC = () => {
  const { paymentMethods, updatePaymentMethod, addPaymentMethod, deletePaymentMethod, loading, error, refreshData } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    active: true
  });

  const openAddModal = () => {
    setFormData({ name: '', details: '', active: true });
    setEditingMethod(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setFormData({
      name: method.name,
      details: method.details,
      active: method.active
    });
    setEditingMethod(method);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingMethod(null);
    setFormData({ name: '', details: '', active: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, formData);
    } else {
      addPaymentMethod(formData);
    }
    closeModal();
  };

  const handleToggleActive = (method: PaymentMethod) => {
    updatePaymentMethod(method.id, { active: !method.active });
  };

  const handleDelete = (method: PaymentMethod) => {
    if (window.confirm(`هل أنت متأكد من حذف طريقة الدفع "${method.name}"؟`)) {
      deletePaymentMethod(method.id);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل طرق الدفع..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة طرق الدفع</h1>
          <p className="text-gray-600 mt-1">إضافة وتعديل طرق الدفع المتاحة للعملاء</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-reverse space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>إضافة طريقة دفع جديدة</span>
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  method.active
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-reverse space-x-4">
                  <div className={`p-3 rounded-xl ${method.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CreditCard className={`h-6 w-6 ${method.active ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      <div className="flex items-center space-x-reverse space-x-1">
                        <button
                          onClick={() => handleToggleActive(method)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            method.active
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {method.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(method)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(method)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm font-mono text-gray-800 break-all">
                        {method.details}
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        method.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.active ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم طريقة الدفع
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="مثل: Vodafone Cash"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تفاصيل الدفع
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    placeholder="رقم الهاتف، عنوان المحفظة، أو أي تفاصيل أخرى"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="mr-3 text-sm text-gray-700">
                    طريقة دفع نشطة ومتاحة
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  {editingMethod ? 'تحديث طريقة الدفع' : 'إضافة طريقة الدفع'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
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

export default PaymentMethodsManager;
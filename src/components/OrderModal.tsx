import React, { useState } from 'react';
import { X, Send, User, FileText, Shield, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, serviceName }) => {
  const { addOrder, siteSettings } = useData();
  const [formData, setFormData] = useState({
    customerName: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName.trim()) {
      addOrder({
        customerName: formData.customerName.trim(),
        serviceName,
        notes: formData.notes.trim(),
        archived: false
      });
      setFormData({ customerName: '', notes: '' });
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">طلب خدمة</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">الخدمة المطلوبة:</h3>
            <div className="flex items-center space-x-reverse space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-blue-700 font-medium">{serviceName}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-reverse space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>اسم العميل *</span>
                </div>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-reverse space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>ملاحظات إضافية (اختياري)</span>
                </div>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="أضف أي تفاصيل إضافية أو طلبات خاصة..."
              />
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-reverse space-x-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">ضمان الأمان</span>
              </div>
              <p className="text-xs text-green-700">
                جميع بياناتك محمية ومشفرة. نحن نحترم خصوصيتك ولا نشارك معلوماتك مع أطراف ثالثة.
              </p>
            </div>
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-reverse space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">معلومات مهمة</span>
              </div>
              <p className="text-sm text-blue-700">
                <strong>تنبيه:</strong> {siteSettings.orderNotice}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2 hover:scale-105 transform"
              >
                <Send className="h-4 w-4" />
                <span>إرسال الطلب</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors hover:border-gray-400"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
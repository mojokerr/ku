import React, { useState } from 'react';
import { Save, Globe, FileText, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, loading, error, refreshData } = useData();
  const [formData, setFormData] = useState({
    title: siteSettings.title,
    description: siteSettings.description,
    orderNotice: siteSettings.orderNotice
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="جاري تحميل الإعدادات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
        <p className="text-gray-600 mt-1">تحكم في النصوص والمحتوى الظاهر في الموقع</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Site Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-reverse space-x-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>عنوان الموقع الرئيسي</span>
              </div>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="عنوان جذاب للموقع"
            />
            <p className="text-xs text-gray-500 mt-1">
              سيظهر هذا العنوان في أعلى الصفحة الرئيسية
            </p>
          </div>

          {/* Site Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-reverse space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>وصف الموقع</span>
              </div>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="وصف تعريفي شامل عن خدمات الموقع"
            />
            <p className="text-xs text-gray-500 mt-1">
              وصف مختصر يظهر تحت العنوان الرئيسي لتعريف العملاء بخدماتك
            </p>
          </div>

          {/* Order Notice */}
          <div>
            <label htmlFor="orderNotice" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-reverse space-x-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span>تنبيه الطلبات</span>
              </div>
            </label>
            <textarea
              id="orderNotice"
              name="orderNotice"
              value={formData.orderNotice}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="رسالة تظهر للعملاء بعد إرسال الطلب"
            />
            <p className="text-xs text-gray-500 mt-1">
              رسالة تنبيه تظهر للعملاء في نموذج الطلب وبعد الإرسال
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">معاينة التغييرات</h2>
        
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {formData.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {formData.description}
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>تنبيه:</strong> {formData.orderNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
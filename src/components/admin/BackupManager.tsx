import React, { useState } from 'react';
import { Download, Upload, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const BackupManager: React.FC = () => {
  const { services, paymentMethods, orders, siteSettings } = useData();
  const [isImporting, setIsImporting] = useState(false);

  const exportData = () => {
    const data = {
      services,
      paymentMethods,
      orders: orders.map(order => ({
        ...order,
        timestamp: order.timestamp.toISOString()
      })),
      siteSettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyctrust-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('تم تصدير البيانات بنجاح');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // التحقق من صحة البيانات
        if (!data.services || !data.paymentMethods || !data.siteSettings) {
          throw new Error('ملف النسخ الاحتياطي غير صالح');
        }

        // حفظ البيانات في localStorage
        localStorage.setItem('kyctrust_services', JSON.stringify(data.services));
        localStorage.setItem('kyctrust_payment_methods', JSON.stringify(data.paymentMethods));
        localStorage.setItem('kyctrust_site_settings', JSON.stringify(data.siteSettings));
        
        if (data.orders) {
          localStorage.setItem('kyctrust_orders', JSON.stringify(data.orders));
        }

        toast.success('تم استيراد البيانات بنجاح! يرجى إعادة تحميل الصفحة');
        
        // إعادة تحميل الصفحة بعد 2 ثانية
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('حدث خطأ في استيراد البيانات');
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      localStorage.removeItem('kyctrust_services');
      localStorage.removeItem('kyctrust_payment_methods');
      localStorage.removeItem('kyctrust_site_settings');
      localStorage.removeItem('kyctrust_orders');
      
      toast.success('تم حذف جميع البيانات! يرجى إعادة تحميل الصفحة');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة النسخ الاحتياطية</h1>
        <p className="text-gray-600 mt-1">تصدير واستيراد بيانات الموقع</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الخدمات</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Database className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طرق الدفع</p>
              <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
            </div>
            <Database className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Database className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الإعدادات</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">تصدير البيانات</h3>
              <p className="text-sm text-gray-600">إنشاء نسخة احتياطية من جميع البيانات</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>جميع الخدمات وطرق الدفع</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>جميع الطلبات والإعدادات</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>ملف JSON قابل للاستيراد</span>
            </div>
          </div>

          <button
            onClick={exportData}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>تصدير البيانات</span>
          </button>
        </div>

        {/* Import */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">استيراد البيانات</h3>
              <p className="text-sm text-gray-600">استعادة البيانات من نسخة احتياطية</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>سيتم استبدال البيانات الحالية</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>تأكد من صحة ملف النسخ الاحتياطي</span>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              disabled={isImporting}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-2 cursor-pointer ${
                isImporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>{isImporting ? 'جاري الاستيراد...' : 'اختيار ملف للاستيراد'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-reverse space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">منطقة الخطر</h3>
        </div>
        
        <p className="text-red-700 mb-4">
          حذف جميع البيانات سيؤدي إلى فقدان جميع الخدمات والطلبات والإعدادات نهائياً.
        </p>
        
        <button
          onClick={clearAllData}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          حذف جميع البيانات
        </button>
      </div>
    </div>
  );
};

export default BackupManager;
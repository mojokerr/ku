import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('admin123123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('kyctrust_admin_password') || 'admin123123';
    
    if (password === savedPassword) {
      onLogin();
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة المرور غير صحيحة');
    }
  };

  const handlePasswordChange = () => {
    const newPassword = prompt('أدخل كلمة المرور الجديدة:');
    if (newPassword && newPassword.length >= 6) {
      localStorage.setItem('kyctrust_admin_password', newPassword);
      setCurrentPassword(newPassword);
      toast.success('تم تغيير كلمة المرور بنجاح');
    } else if (newPassword) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl inline-block mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              لوحة تحكم KYCtrust
            </h1>
            <p className="text-gray-600">
              يرجى إدخال كلمة المرور للدخول
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-reverse space-x-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>كلمة المرور</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              تسجيل الدخول
            </button>
          </form>

          {/* Change Password */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handlePasswordChange}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              تغيير كلمة المرور
            </button>
          </div>

          {/* Default Password Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              كلمة المرور الافتراضية: admin123123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
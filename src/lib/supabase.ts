import { createClient } from '@supabase/supabase-js';

// ✅ معلومات الاتصال الحقيقية (من البيئة)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://afqffxcfxvvaiarfelqc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcWZmeGNmeHZ2YWlhcmZlbHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTAxMzcsImV4cCI6MjA2OTUyNjEzN30.hVkxXbrDoIn6L_f41dWY0zw3bYTahvaajw7uxiMEydQ';

// ✅ التحقق من البيئة
const isDevelopment = import.meta.env.MODE === 'development';
const hasValidConfig =
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl !== '' &&
  supabaseAnonKey !== '';

// ⚠️ تحذير في وضع التطوير فقط
if (isDevelopment && !hasValidConfig) {
  console.warn('⚠️ Supabase not configured. Using local storage fallback for development.');
  console.warn('To connect to Supabase, create a .env file with:');
  console.warn('VITE_SUPABASE_URL=https://afqffxcfxvvaiarfelqc.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

// ✅ إنشاء عميل Supabase
export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 🔄 فلاج للتأكد من إن Supabase متاح
export const isSupabaseConfigured = hasValidConfig;

// ✅ أنواع الجداول في قاعدة البيانات
export interface DatabaseService {
  id: string;
  name: string;
  price: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePaymentMethod {
  id: string;
  name: string;
  details: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: string;
  customer_name: string;
  service_name: string;
  notes: string;
  status: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSiteSettings {
  id: string;
  title: string;
  description: string;
  order_notice: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAdminUser {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { servicesService, paymentMethodsService, ordersService, siteSettingsService } from '../services/database';

export interface Service {
  id: string;
  name: string;
  price: string;
  order: number;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string;
  active: boolean;
}

export interface SiteSettings {
  title: string;
  description: string;
  orderNotice: string;
}

export interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  notes: string;
  timestamp: Date;
  archived: boolean;
}

interface DataContextType {
  services: Service[];
  paymentMethods: PaymentMethod[];
  siteSettings: SiteSettings;
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateService: (id: string, updates: Partial<Service>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  archiveOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultServices: Service[] = [
  { id: '1', name: 'Payoneer', price: '30$', order: 1, active: true },
  { id: '2', name: 'Wise', price: '30$', order: 2, active: true },
  { id: '3', name: 'Skrill', price: '20$', order: 3, active: true },
  { id: '4', name: 'Neteller', price: '20$', order: 4, active: true },
  { id: '5', name: 'Kast', price: '20$', order: 5, active: true },
  { id: '6', name: 'Redotpay', price: '20$', order: 6, active: true },
  { id: '7', name: 'Okx', price: '20$', order: 7, active: true },
  { id: '8', name: 'World First', price: '20$', order: 8, active: true },
  { id: '9', name: 'Bybit', price: '20$', order: 9, active: true },
  { id: '10', name: 'Bitget', price: '20$', order: 10, active: true },
  { id: '11', name: 'Kucoin', price: '20$', order: 11, active: true },
  { id: '12', name: 'PayPal', price: '15$', order: 12, active: true },
  { id: '13', name: 'Mexc', price: '20$', order: 13, active: true },
  { id: '14', name: 'Exness', price: '20$', order: 14, active: true },
  { id: '15', name: 'شحن رصيد فودافون', price: '100 جنيه = 120 جنيه (متاح أي مبلغ)', order: 15, active: true },
  { id: '16', name: 'سحب من TikTok', price: 'حسب الاتفاق', order: 16, active: true },
  { id: '17', name: 'سحب من PayPal', price: 'حسب الاتفاق', order: 17, active: true },
];

const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Vodafone Cash', details: '01062453344', active: true },
  { id: '2', name: 'USDT (TRC20)', details: 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', active: true },
];

const defaultSiteSettings: SiteSettings = {
  title: 'KYCtrust - خدمات مالية رقمية موثوقة',
  description: 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية',
  orderNotice: 'سيتم التواصل معك يدويًا عبر واتساب بعد إرسال الطلب.'
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [servicesData, paymentMethodsData, ordersData, siteSettingsData] = await Promise.all([
        servicesService.getAll(),
        paymentMethodsService.getAll(),
        ordersService.getAll(),
        siteSettingsService.get().catch(() => defaultSiteSettings)
      ]);

      setServices(servicesData);
      setPaymentMethods(paymentMethodsData);
      setOrders(ordersData);
      setSiteSettings(siteSettingsData);
    } catch (err) {
      console.error('Error loading data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error details:', errorMessage);
      setError('حدث خطأ في تحميل البيانات');
      
      // Fallback to localStorage if database fails
      const savedServices = localStorage.getItem('kyctrust_services');
      const savedPaymentMethods = localStorage.getItem('kyctrust_payment_methods');
      const savedSiteSettings = localStorage.getItem('kyctrust_site_settings');
      const savedOrders = localStorage.getItem('kyctrust_orders');

      if (savedServices) {
        setServices(JSON.parse(savedServices));
      } else {
        setServices(defaultServices);
      }

      if (savedPaymentMethods) {
        setPaymentMethods(JSON.parse(savedPaymentMethods));
      } else {
        setPaymentMethods(defaultPaymentMethods);
      }

      if (savedSiteSettings) {
        setSiteSettings(JSON.parse(savedSiteSettings));
      }

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders.map((order: any) => ({
          ...order,
          timestamp: new Date(order.timestamp)
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const updatedService = await servicesService.update(id, updates);
      const updatedServices = services.map(service =>
        service.id === id ? updatedService : service
      );
      setServices(updatedServices);
      saveToStorage('kyctrust_services', updatedServices);
      toast.success('تم تحديث الخدمة بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error updating service:', errorMessage);
      toast.error('حدث خطأ في تحديث الخدمة');
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const newService = await servicesService.create(service);
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      saveToStorage('kyctrust_services', updatedServices);
      toast.success('تم إضافة الخدمة بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error adding service:', errorMessage);
      toast.error('حدث خطأ في إضافة الخدمة');
    }
  };

  const deleteService = async (id: string) => {
    try {
      await servicesService.delete(id);
      const updatedServices = services.filter(service => service.id !== id);
      setServices(updatedServices);
      saveToStorage('kyctrust_services', updatedServices);
      toast.success('تم حذف الخدمة بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting service:', errorMessage);
      toast.error('حدث خطأ في حذف الخدمة');
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      const updatedMethod = await paymentMethodsService.update(id, updates);
      const updatedMethods = paymentMethods.map(method =>
        method.id === id ? updatedMethod : method
      );
      setPaymentMethods(updatedMethods);
      saveToStorage('kyctrust_payment_methods', updatedMethods);
      toast.success('تم تحديث طريقة الدفع بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error updating payment method:', errorMessage);
      toast.error('حدث خطأ في تحديث طريقة الدفع');
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    try {
      const newMethod = await paymentMethodsService.create(method);
      const updatedMethods = [...paymentMethods, newMethod];
      setPaymentMethods(updatedMethods);
      saveToStorage('kyctrust_payment_methods', updatedMethods);
      toast.success('تم إضافة طريقة الدفع بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error adding payment method:', errorMessage);
      toast.error('حدث خطأ في إضافة طريقة الدفع');
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await paymentMethodsService.delete(id);
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      setPaymentMethods(updatedMethods);
      saveToStorage('kyctrust_payment_methods', updatedMethods);
      toast.success('تم حذف طريقة الدفع بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting payment method:', errorMessage);
      toast.error('حدث خطأ في حذف طريقة الدفع');
    }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    try {
      const updatedSettings = await siteSettingsService.update(settings);
      setSiteSettings(updatedSettings);
      saveToStorage('kyctrust_site_settings', updatedSettings);
      toast.success('تم تحديث إعدادات الموقع بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error updating site settings:', errorMessage);
      toast.error('حدث خطأ في تحديث إعدادات الموقع');
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    try {
      const newOrder = await ordersService.create(order);
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      saveToStorage('kyctrust_orders', updatedOrders);
      toast.success('تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error adding order:', errorMessage);
      toast.error('حدث خطأ في إرسال الطلب');
    }
  };

  const archiveOrder = async (id: string) => {
    try {
      const updatedOrder = await ordersService.update(id, { archived: true });
      const updatedOrders = orders.map(order =>
        order.id === id ? updatedOrder : order
      );
      setOrders(updatedOrders);
      saveToStorage('kyctrust_orders', updatedOrders);
      toast.success('تم أرشفة الطلب بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error archiving order:', errorMessage);
      toast.error('حدث خطأ في أرشفة الطلب');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await ordersService.delete(id);
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
      saveToStorage('kyctrust_orders', updatedOrders);
      toast.success('تم حذف الطلب بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting order:', errorMessage);
      toast.error('حدث خطأ في حذف الطلب');
    }
  };

  const value: DataContextType = {
    services,
    paymentMethods,
    siteSettings,
    orders,
    loading,
    error,
    updateService,
    addService,
    deleteService,
    updatePaymentMethod,
    addPaymentMethod,
    deletePaymentMethod,
    updateSiteSettings,
    addOrder,
    archiveOrder,
    deleteOrder,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

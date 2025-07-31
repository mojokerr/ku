import { supabase, isSupabaseConfigured, DatabaseService, DatabasePaymentMethod, DatabaseOrder, DatabaseSiteSettings } from '../lib/supabase';
import { Service, PaymentMethod, Order, SiteSettings } from '../context/DataContext';

// Helper function to check if we can use Supabase
const checkSupabaseAvailable = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured. Using local storage fallback.');
  }
  return supabase;
};

// خدمات قاعدة البيانات للخدمات
export const servicesService = {
  async getAll(): Promise<Service[]> {
    try {
      const client = checkSupabaseAvailable();
      const { data, error } = await client
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      return data.map((item: DatabaseService) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        order: item.order_index,
        active: item.active
      }));
    } catch (error) {
      // Fallback to empty array if Supabase is not configured
      console.warn('Supabase not available, returning empty services array');
      return [];
    }
  },

  async create(service: Omit<Service, 'id'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        price: service.price,
        order_index: service.order,
        active: service.active
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      order: data.order_index,
      active: data.active
    };
  },

  async update(id: string, updates: Partial<Service>): Promise<Service> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.order !== undefined) updateData.order_index = updates.order;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      order: data.order_index,
      active: data.active
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// خدمات قاعدة البيانات لطرق الدفع
export const paymentMethodsService = {
  async getAll(): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map((item: DatabasePaymentMethod) => ({
      id: item.id,
      name: item.name,
      details: item.details,
      active: item.active
    }));
  },

  async create(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        name: method.name,
        details: method.details,
        active: method.active
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      details: data.details,
      active: data.active
    };
  },

  async update(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      details: data.details,
      active: data.active
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// خدمات قاعدة البيانات للطلبات
export const ordersService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((item: DatabaseOrder) => ({
      id: item.id,
      customerName: item.customer_name,
      serviceName: item.service_name,
      notes: item.notes,
      timestamp: new Date(item.created_at),
      archived: item.archived
    }));
  },

  async create(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        service_name: order.serviceName,
        notes: order.notes,
        archived: order.archived
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      customerName: data.customer_name,
      serviceName: data.service_name,
      notes: data.notes,
      timestamp: new Date(data.created_at),
      archived: data.archived
    };
  },

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const updateData: any = {};
    if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
    if (updates.serviceName !== undefined) updateData.service_name = updates.serviceName;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.archived !== undefined) updateData.archived = updates.archived;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      customerName: data.customer_name,
      serviceName: data.service_name,
      notes: data.notes,
      timestamp: new Date(data.created_at),
      archived: data.archived
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// خدمات قاعدة البيانات لإعدادات الموقع
export const siteSettingsService = {
  async get(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;

    return {
      title: data.title,
      description: data.description,
      orderNotice: data.order_notice
    };
  },

  async update(settings: SiteSettings): Promise<SiteSettings> {
    // أولاً نحاول الحصول على الإعدادات الحالية
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      // تحديث الإعدادات الموجودة
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          title: settings.title,
          description: settings.description,
          order_notice: settings.orderNotice
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // إنشاء إعدادات جديدة
      const { data, error } = await supabase
        .from('site_settings')
        .insert({
          title: settings.title,
          description: settings.description,
          order_notice: settings.orderNotice
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return {
      title: result.title,
      description: result.description,
      orderNotice: result.order_notice
    };
  }
};

// API endpoints for admin panel
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface LandingPageContent {
  id: string;
  section: string;
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    image?: string;
    isVisible?: boolean;
    order?: number;
  };
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
  order: number;
  features: string[];
  category: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

class AdminAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Landing Page Content Management
  async getLandingPageContent(): Promise<LandingPageContent[]> {
    return this.request<LandingPageContent[]>('/admin/landing-page');
  }

  async updateLandingPageContent(sectionId: string, content: Partial<LandingPageContent['content']>): Promise<LandingPageContent> {
    return this.request<LandingPageContent>(`/admin/landing-page/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async createLandingPageSection(section: Omit<LandingPageContent, 'id' | 'updatedAt'>): Promise<LandingPageContent> {
    return this.request<LandingPageContent>('/admin/landing-page', {
      method: 'POST',
      body: JSON.stringify(section),
    });
  }

  async deleteLandingPageSection(sectionId: string): Promise<void> {
    return this.request<void>(`/admin/landing-page/${sectionId}`, {
      method: 'DELETE',
    });
  }

  // Services Management
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/admin/services');
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    return this.request<Service>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async updateService(serviceId: string, service: Partial<Service>): Promise<Service> {
    return this.request<Service>(`/admin/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  }

  async deleteService(serviceId: string): Promise<void> {
    return this.request<void>(`/admin/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  async toggleServiceStatus(serviceId: string, active: boolean): Promise<Service> {
    return this.request<Service>(`/admin/services/${serviceId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  // Site Settings Management
  async getSiteSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/admin/settings');
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.request<SiteSettings>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Analytics
  async getAnalytics(period: '7d' | '30d' | '90d' = '30d') {
    return this.request(`/admin/analytics?period=${period}`);
  }

  // File Upload
  async uploadFile(file: File, type: 'image' | 'document' = 'image'): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // Backup & Export
  async exportData(type: 'full' | 'content' | 'settings' = 'content') {
    return this.request(`/admin/export?type=${type}`);
  }

  async importData(data: any): Promise<{ success: boolean; message: string }> {
    return this.request('/admin/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Mock API implementation for development
class MockAdminAPI extends AdminAPI {
  private mockData = {
    landingPageContent: [
      {
        id: '1',
        section: 'hero',
        content: {
          title: 'مستقبل الخدمات',
          subtitle: 'المالية الرقمية',
          description: 'نحن نعيد تعريف الخدمات المالية الرقمية من خلال تقديم حلول مبتكرة وآمنة ومتطورة',
          buttonText: 'ابدأ الآن',
          isVisible: true,
          order: 1
        },
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        section: 'services',
        content: {
          title: 'خدماتنا المتميزة',
          description: 'نقدم مجموعة شاملة من الخدمات المالية الرقمية',
          isVisible: true,
          order: 2
        },
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        section: 'features',
        content: {
          title: 'لماذا نحن الأفضل؟',
          description: 'نجمع بين الأمان والسرعة والموثوقية',
          isVisible: true,
          order: 3
        },
        updatedAt: new Date().toISOString()
      }
    ] as LandingPageContent[],

    services: [
      {
        id: '1',
        name: 'PayPal',
        description: 'خدمة PayPal موثوقة وآمنة',
        price: '$5.00',
        active: true,
        order: 1,
        features: ['تنفيذ فوري', 'أمان عالي', 'دعم 24/7'],
        category: 'wallets'
      },
      {
        id: '2',
        name: 'Wise',
        description: 'تحويلات دولية بأفضل أسعار الصرف',
        price: '$3.50',
        active: true,
        order: 2,
        features: ['أسعار صرف حقيقية', 'رسوم منخفضة', 'تحويل سريع'],
        category: 'banking'
      }
    ] as Service[],

    siteSettings: {
      id: '1',
      siteName: 'KYCtrust',
      siteDescription: 'منصة الخدمات المالية الرقمية الموثوقة',
      contactInfo: {
        phone: '+966 50 123 4567',
        email: 'support@kyctrust.com',
        address: 'الرياض، المملكة العربية السعودية',
        workingHours: '24/7'
      },
      socialMedia: {
        instagram: 'https://instagram.com/kyctrust',
        twitter: 'https://twitter.com/kyctrust',
        linkedin: 'https://linkedin.com/company/kyctrust',
        youtube: 'https://youtube.com/kyctrust'
      },
      seo: {
        title: 'KYCtrust - منصة الخدمات المالية الرقمية',
        description: 'أفضل منصة للخدمات المالية الرقمية في المنطقة',
        keywords: ['خدمات مالية', 'محافظ رقمية', 'تحويلات', 'PayPal', 'Wise']
      }
    } as SiteSettings
  };

  async getLandingPageContent(): Promise<LandingPageContent[]> {
    await this.delay();
    return [...this.mockData.landingPageContent];
  }

  async updateLandingPageContent(sectionId: string, content: Partial<LandingPageContent['content']>): Promise<LandingPageContent> {
    await this.delay();
    const section = this.mockData.landingPageContent.find(s => s.id === sectionId);
    if (!section) throw new Error('Section not found');
    
    section.content = { ...section.content, ...content };
    section.updatedAt = new Date().toISOString();
    return { ...section };
  }

  async getServices(): Promise<Service[]> {
    await this.delay();
    return [...this.mockData.services];
  }

  async updateService(serviceId: string, service: Partial<Service>): Promise<Service> {
    await this.delay();
    const existingService = this.mockData.services.find(s => s.id === serviceId);
    if (!existingService) throw new Error('Service not found');
    
    Object.assign(existingService, service);
    return { ...existingService };
  }

  async getSiteSettings(): Promise<SiteSettings> {
    await this.delay();
    return { ...this.mockData.siteSettings };
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    await this.delay();
    Object.assign(this.mockData.siteSettings, settings);
    return { ...this.mockData.siteSettings };
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const adminAPI = import.meta.env.PROD ? new AdminAPI() : new MockAdminAPI();
export default adminAPI;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for customizable elements
export interface HeroSection {
  id: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  button1Text: string;
  button2Text: string;
  badgeText: string;
  backgroundImage?: string;
  showStats: boolean;
  statsData: {
    clients: string;
    successRate: string;
    support: string;
    speed: string;
  };
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  color: string;
  order: number;
  active: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
  order: number;
  active: boolean;
}

export interface SectionSettings {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  order: number;
  active: boolean;
  backgroundColor: string;
  textColor: string;
  padding: string;
}

export interface LandingPageCustomization {
  id: string;
  hero: HeroSection;
  features: FeatureItem[];
  testimonials: TestimonialItem[];
  sections: SectionSettings[];
  globalSettings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: string;
    spacing: string;
  };
  updated_at: string;
}

interface CustomizationContextType {
  customization: LandingPageCustomization | null;
  loading: boolean;
  error: string | null;
  updateHeroSection: (hero: Partial<HeroSection>) => Promise<void>;
  updateFeature: (id: string, updates: Partial<FeatureItem>) => Promise<void>;
  addFeature: (feature: Omit<FeatureItem, 'id'>) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => Promise<void>;
  addTestimonial: (testimonial: Omit<TestimonialItem, 'id'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateSection: (id: string, updates: Partial<SectionSettings>) => Promise<void>;
  updateGlobalSettings: (settings: Partial<LandingPageCustomization['globalSettings']>) => Promise<void>;
  reorderSections: (sections: SectionSettings[]) => Promise<void>;
  refreshCustomization: () => Promise<void>;
}

const defaultCustomization: LandingPageCustomization = {
  id: 'default',
  hero: {
    id: 'hero-1',
    title: 'مستقبل الخدمات',
    titleGradient: 'المالية الرقمية',
    subtitle: 'نحن نعيد تعريف الخدمات المالية الرقمية من خلال تقديم حلول مبتكرة وآمنة ومتطورة تلبي احتياجاتك المالية بكفاءة عالية وموثوقية استثنائية',
    button1Text: 'ابدأ رحلتك معنا',
    button2Text: 'استكشف خدماتنا',
    badgeText: 'منصة رائدة في الخدمات المالية الرقمية',
    showStats: true,
    statsData: {
      clients: '5000+',
      successRate: '99.9%',
      support: '24/7',
      speed: '< 5 دقائق'
    }
  },
  features: [
    {
      id: 'feature-1',
      title: 'أمان متقدم',
      description: 'تشفير متقدم وحماية شاملة لجميع معاملاتك المالية',
      icon: 'Shield',
      color: 'from-blue-500 to-cyan-500',
      order: 1,
      active: true
    },
    {
      id: 'feature-2',
      title: 'سرعة البرق',
      description: 'معالجة فورية للطلبات في أقل من 5 دقائق',
      icon: 'Zap',
      color: 'from-orange-500 to-red-500',
      order: 2,
      active: true
    },
    {
      id: 'feature-3',
      title: 'دعم استثنائي',
      description: 'فريق دعم محترف متاح 24/7 لمساعدتك',
      icon: 'Users',
      color: 'from-purple-500 to-violet-500',
      order: 3,
      active: true
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'أحمد محمد',
      role: 'رائد أعمال',
      content: 'خدمة استثنائية وسرعة في التنفيذ. لقد حلت KYCtrust جميع مشاكلي المالية الرقمية بكفاءة عالية.',
      image: 'https://cdn.builder.io/o/assets%2Ffecc8303db7a436198cd2aa7c3929ce5%2F7470222f170540bfb62653d90decfb50?alt=media&token=ee2a057b-a053-447e-87ec-872032496662&apiKey=fecc8303db7a436198cd2aa7c3929ce5',
      rating: 5,
      order: 1,
      active: true
    }
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      title: 'القسم الرئيسي',
      subtitle: 'المنطقة الأولى التي يراها الزوار',
      order: 1,
      active: true,
      backgroundColor: 'from-slate-50 via-blue-50 to-indigo-50',
      textColor: 'text-gray-900',
      padding: 'py-24'
    },
    {
      id: 'services',
      name: 'Services Section',
      title: 'قسم الخدمات',
      subtitle: 'عرض الخدمات المتاحة',
      order: 2,
      active: true,
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900',
      padding: 'py-24'
    },
    {
      id: 'features',
      name: 'Features Section',
      title: 'قسم المميزات',
      subtitle: 'المميزات والفوائد',
      order: 3,
      active: true,
      backgroundColor: 'from-slate-50 to-blue-50',
      textColor: 'text-gray-900',
      padding: 'py-24'
    }
  ],
  globalSettings: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    fontFamily: 'Cairo',
    borderRadius: '1rem',
    spacing: '1.5rem'
  },
  updated_at: new Date().toISOString()
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customization, setCustomization] = useState<LandingPageCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomization = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from localStorage first (fallback)
      const savedCustomization = localStorage.getItem('kyctrust_customization');
      if (savedCustomization) {
        setCustomization(JSON.parse(savedCustomization));
      } else {
        setCustomization(defaultCustomization);
      }

      // Here you can add API call to load from database
      // const response = await fetch('/api/customization');
      // const data = await response.json();
      // setCustomization(data);

    } catch (err) {
      console.error('Error loading customization:', err);
      setError('فشل في تحميل إعدادات التخصيص');
      setCustomization(defaultCustomization);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomization = async (newCustomization: LandingPageCustomization) => {
    try {
      // Save to localStorage
      localStorage.setItem('kyctrust_customization', JSON.stringify(newCustomization));
      
      // Here you can add API call to save to database
      // await fetch('/api/customization', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCustomization)
      // });

      setCustomization(newCustomization);
    } catch (err) {
      console.error('Error saving customization:', err);
      throw new Error('فشل في حفظ إعدادات التخصيص');
    }
  };

  const updateHeroSection = async (hero: Partial<HeroSection>) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      hero: { ...customization.hero, ...hero },
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const updateFeature = async (id: string, updates: Partial<FeatureItem>) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      features: customization.features.map(feature =>
        feature.id === id ? { ...feature, ...updates } : feature
      ),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const addFeature = async (feature: Omit<FeatureItem, 'id'>) => {
    if (!customization) return;
    
    const newFeature: FeatureItem = {
      ...feature,
      id: `feature-${Date.now()}`
    };
    
    const updated = {
      ...customization,
      features: [...customization.features, newFeature],
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const deleteFeature = async (id: string) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      features: customization.features.filter(feature => feature.id !== id),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const updateTestimonial = async (id: string, updates: Partial<TestimonialItem>) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      testimonials: customization.testimonials.map(testimonial =>
        testimonial.id === id ? { ...testimonial, ...updates } : testimonial
      ),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const addTestimonial = async (testimonial: Omit<TestimonialItem, 'id'>) => {
    if (!customization) return;
    
    const newTestimonial: TestimonialItem = {
      ...testimonial,
      id: `testimonial-${Date.now()}`
    };
    
    const updated = {
      ...customization,
      testimonials: [...customization.testimonials, newTestimonial],
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const deleteTestimonial = async (id: string) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      testimonials: customization.testimonials.filter(testimonial => testimonial.id !== id),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const updateSection = async (id: string, updates: Partial<SectionSettings>) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      sections: customization.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const updateGlobalSettings = async (settings: Partial<LandingPageCustomization['globalSettings']>) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      globalSettings: { ...customization.globalSettings, ...settings },
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const reorderSections = async (sections: SectionSettings[]) => {
    if (!customization) return;
    
    const updated = {
      ...customization,
      sections: sections.map((section, index) => ({ ...section, order: index + 1 })),
      updated_at: new Date().toISOString()
    };
    
    await saveCustomization(updated);
  };

  const refreshCustomization = async () => {
    await loadCustomization();
  };

  useEffect(() => {
    loadCustomization();
  }, []);

  const value: CustomizationContextType = {
    customization,
    loading,
    error,
    updateHeroSection,
    updateFeature,
    addFeature,
    deleteFeature,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    updateSection,
    updateGlobalSettings,
    reorderSections,
    refreshCustomization,
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

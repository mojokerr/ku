import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, Eye, EyeOff, Edit3, Palette, Type, Image as ImageIcon,
  Settings, RefreshCw, Download, Upload, RotateCcw, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCustomization } from '../../context/CustomizationContext';
import adminAPI, { LandingPageContent } from '../../api/admin';

interface LiveLandingPageEditorProps {
  className?: string;
}

const LiveLandingPageEditor: React.FC<LiveLandingPageEditorProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const { customization, updateCustomization } = useCustomization();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sections, setSections] = useState<LandingPageContent[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Editor state
  const [editedContent, setEditedContent] = useState<Record<string, any>>({});

  // Load sections from API
  const loadSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminAPI.getLandingPageContent();
      setSections(data);
    } catch (error) {
      console.error('Failed to load sections:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes
  const saveChanges = useCallback(async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      // Save each modified section
      for (const [sectionId, content] of Object.entries(editedContent)) {
        await adminAPI.updateLandingPageContent(sectionId, content);
      }

      // Update customization context
      updateCustomization({
        ...customization,
        lastUpdated: new Date().toISOString()
      });

      setLastSaved(new Date());
      setIsDirty(false);
      setEditedContent({});
      await loadSections();
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, editedContent, customization, updateCustomization, loadSections]);

  // Update section content
  const updateSectionContent = useCallback((sectionId: string, field: string, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
    setIsDirty(true);
  }, []);

  // Get effective content (with edits applied)
  const getEffectiveContent = useCallback((section: LandingPageContent) => {
    const edits = editedContent[section.id] || {};
    return { ...section.content, ...edits };
  }, [editedContent]);

  // Load data on mount
  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    if (!isDirty) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirty && !isSaving) {
        saveChanges();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [isDirty, isSaving, saveChanges]);

  const sectionComponents = {
    hero: (section: LandingPageContent) => {
      const content = getEffectiveContent(section);
      return (
        <div className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 ${
          selectedSection === section.id 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}>
          {/* Edit Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4 flex space-x-reverse space-x-2">
              <button
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="تحرير القسم"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center space-y-6">
            {/* Title */}
            {isEditing && selectedSection === section.id ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان الرئيسي</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="العنوان الرئيسي"
                />
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                {content.title}
              </h1>
            )}

            {/* Subtitle */}
            {isEditing && selectedSection === section.id ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان الفرعي</label>
                <input
                  type="text"
                  value={content.subtitle || ''}
                  onChange={(e) => updateSectionContent(section.id, 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="العنوان الفرعي"
                />
              </div>
            ) : (
              <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {content.subtitle}
              </h2>
            )}

            {/* Description */}
            {isEditing && selectedSection === section.id ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateSectionContent(section.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="وصف القسم"
                />
              </div>
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {content.description}
              </p>
            )}

            {/* Button */}
            {isEditing && selectedSection === section.id ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">��ص الزر</label>
                <input
                  type="text"
                  value={content.buttonText || ''}
                  onChange={(e) => updateSectionContent(section.id, 'buttonText', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="نص الزر"
                />
              </div>
            ) : (
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all">
                {content.buttonText}
              </button>
            )}
          </div>
        </div>
      );
    },

    services: (section: LandingPageContent) => {
      const content = getEffectiveContent(section);
      return (
        <div className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 ${
          selectedSection === section.id 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}>
          {/* Edit Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center space-y-6">
            {/* Title */}
            {isEditing && selectedSection === section.id ? (
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-3xl font-bold"
                placeholder="عنوان قسم الخدمات"
              />
            ) : (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {content.title}
              </h2>
            )}

            {/* Description */}
            {isEditing && selectedSection === section.id ? (
              <textarea
                value={content.description || ''}
                onChange={(e) => updateSectionContent(section.id, 'description', e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-center"
                placeholder="وصف قسم الخدمات"
              />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {content.description}
              </p>
            )}
          </div>
        </div>
      );
    },

    features: (section: LandingPageContent) => {
      const content = getEffectiveContent(section);
      return (
        <div className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 ${
          selectedSection === section.id 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}>
          {/* Edit Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center space-y-6">
            {/* Title */}
            {isEditing && selectedSection === section.id ? (
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-3xl font-bold"
                placeholder="عنوان قسم المميزات"
              />
            ) : (
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {content.title}
              </h2>
            )}

            {/* Description */}
            {isEditing && selectedSection === section.id ? (
              <textarea
                value={content.description || ''}
                onChange={(e) => updateSectionContent(section.id, 'description', e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-center"
                placeholder="وصف قسم المميزات"
              />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {content.description}
              </p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`${className}`}>
      {/* Editor Toolbar */}
      <div className={`sticky top-0 z-50 p-4 rounded-xl mb-6 border ${
        theme === 'dark' 
          ? 'bg-gray-800/95 border-gray-700 backdrop-blur-md' 
          : 'bg-white/95 border-gray-200 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-4">
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              محرر صفحة الهبوط المباشر
            </h3>
            
            {lastSaved && (
              <div className="flex items-center space-x-reverse space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  آخر حفظ: {lastSaved.toLocaleTimeString('ar-EG')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-reverse space-x-3">
            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-lg transition-colors ${
                previewMode
                  ? 'bg-green-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {previewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{previewMode ? 'معاينة' : 'تحرير'}</span>
            </button>

            {/* Edit Toggle */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'إنهاء التحرير' : 'بدء التحرير'}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={saveChanges}
              disabled={!isDirty || isSaving}
              className={`flex items-center space-x-reverse space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDirty && !isSaving
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadSections}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="تحديث"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {(isLoading || isSaving) && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Dirty State Warning */}
      {isDirty && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              لديك تغييرات غير محفوظة. سيتم الحفظ التلقائي خلال 30 ثانية.
            </span>
          </div>
        </div>
      )}

      {/* Sections Preview/Editor */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">جاري تحميل الأقسام...</p>
          </div>
        ) : (
          sections.map(section => (
            <div key={section.id}>
              {sectionComponents[section.section as keyof typeof sectionComponents]?.(section) || (
                <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    قسم غير مدعوم: {section.section}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      {isEditing && (
        <div className={`mt-8 p-6 rounded-xl border ${
          theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            تعليمات الاستخدام:
          </h4>
          <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>• اضغط على أيقونة التحرير في أي قسم لبدء تعديله</li>
            <li>• سيتم حفظ التغييرات تلقائياً كل 30 ثانية</li>
            <li>• يمكنك الضغط على "حفظ التغييرات" للحفظ الفوري</li>
            <li>• استخدم زر "معاينة" لرؤية النتيجة النهائية</li>
            <li>• التغييرات ستظهر فوراً على الموقع المباشر</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveLandingPageEditor;

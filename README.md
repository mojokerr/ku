# KYCtrust - منصة الخدمات المالية الرقمية

![GitHub](https://img.shields.io/github/license/username/kyctrust)
![Build Status](https://img.shields.io/github/actions/workflow/status/username/kyctrust/test.yml)
![Coverage](https://img.shields.io/codecov/c/github/username/kyctrust)
![Version](https://img.shields.io/github/package-json/v/username/kyctrust)

منصة شاملة لتقديم الخدمات المالية الرقمية مع واجهة عربية حديثة ولوحة تحكم متكاملة.

## 🌟 المميزات

- ✅ **واجهة عربية حديثة** - تصميم متجاوب يدعم RTL
- ✅ **الوضع المظلم** - تجربة مستخدم محسنة مع ألوان مطفية
- ✅ **لوحة تح��م شاملة** - إدارة كاملة للخدمات والطلبات
- ✅ **دعم متعدد اللغات** - عربي/إنجليزي
- ✅ **تقارير وإحصائيات** - تحليل شامل للأداء
- ✅ **نسخ احتياطية** - حماية البيانات
- ✅ **أمان عالي** - حماية متقدمة للمعلومات

## 🚀 التقنيات المستخدمة

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Database**: Supabase
- **Deployment**: GitHub Pages / Docker

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- npm أو yarn

### التثبيت

```bash
# نسخ المشروع
git clone https://github.com/username/kyctrust.git
cd kyctrust

# تثبيت التبعيات
npm install

# تشغيل المشروع في وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview
```

### متغيرات البيئة (اختيارية)

**ملاحظة**: المشروع يعمل مع LocalStorage كـ fallback عند عدم توفر Supabase.

لتوصيل قاعدة بيانات Supabase:

1. أنشئ مشروع جديد على [Supabase](https://supabase.com)
2. قم بإنشاء ملف `.env` في جذر المشروع:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. أو استخدم أداة DevServerControl:
```bash
# تعديل متغيرات البيئة عبر واجهة المطور
```

**بدون Supabase**: سيستخدم المشروع LocalStorage لحفظ البيانات محلياً.

## 🐳 Docker

```bash
# بناء الصورة
docker build -t kyctrust .

# تشغيل الحاوية
docker run -p 3000:80 kyctrust

# أو استخدام docker-compose
docker-compose up -d
```

## 📁 هيكل المشروع

```
src/
├── components/           # المكونات القابلة لإعادة الاستخدام
│   ├── admin/           # مكونات لوحة التحكم
│   └── ...
├── context/             # إدارة الحالة
├── lib/                 # المكتبات والإعدادات
├── services/            # خدمات API
├── utils/               # دوال مساعدة
└── ...
```

## 🛠️ لوحة التحكم

### الوصول
- الرابط: `/admin`
- البيانات الافتراضية:
  - المستخدم: `admin`
  - كلمة المرور: `admin123`

### الوظائف المتاحة

1. **لوحة القيادة** - إحصائيات شاملة
2. **إدارة الخدمات** - إضافة/تعديل/حذف الخدمات
3. **إدارة طرق الدفع** - تكوين وسائل الدفع
4. **إدارة الطلبات** - تتبع ومعالجة الطلبات
5. **التحليلات** - تقارير الأداء والإحصائيات
6. **إدارة المستخدمين** - صلاحيات وأدوار المستخدمين
7. **التقارير** - إنشاء تقارير مخصصة
8. **النسخ الاحتياطية** - تصدير/استيراد البيانات
9. **تخصيص الموقع** - تعديل المظهر والمحتوى
10. **إعدادات الموقع** - إعدادات عامة

## 🎨 التخصيص

### الألوان
يمكن تخصيص الألوان من خلال لوحة التحكم أو تعديل ملف `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6'
      }
    }
  }
}
```

### الترجمة
أضف ترجمات جديدة في `src/utils/translations.ts`:

```typescript
export const translations = {
  ar: {
    // الترجمة العربية
  },
  en: {
    // الترجمة الإنجليزية
  }
}
```

## 🔒 الأمان

- تشفير البيانات الحساسة
- حماية CSRF
- التحقق من الهوية
- تسجيل العمليات
- نسخ احتياطية آمنة

## 📊 التقارير والإحصائيات

- تقارير الطلبات اليومية/الأسبوعية/الشهرية
- إحصائيات الخدمات الأكثر طلباً
- تحليل سلوك المستخدمين
- تقارير مالية شاملة
- تصدير البيانات بصيغ متعددة (PDF, Excel, CSV)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- الموقع: [https://kyctrust.com](https://kyctrust.com)
- البريد الإلكتروني: support@kyctrust.com
- التلجرام: [@kyctrust_support](https://t.me/kyctrust_support)

## 🚀 خارطة الطريق

- [ ] تطبيق موبايل (React Native)
- [ ] API منفصل (Node.js/Express)
- [ ] دعم العملات المشفرة
- [ ] نظام الإشعارات الفورية
- [ ] تكامل مع البنوك المحلية
- [ ] نظام النقاط والمكافآت

---

**ملاحظة**: هذا المشروع في مرحلة التطوير النشط. نرحب بالتغذية الراجعة والاقتراحات.

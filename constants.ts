
import { Product, Category } from './types';

export const FACEBOOK_PIXEL_ID = '1234567890'; 
export const WHATSAPP_NUMBER = '212688775968';

/**
 * قائمة المنتجات الدائمة للمتجر.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'smart-glasses-pro-v11',
    title: 'نظارات ذكية بلوتوث Pro - موسيقى ومكالمات لاسلكية',
    price: 199,
    oldPrice: 350,
    category: Category.GLASSES,
    description: `استمتع بالحرية الكاملة مع النظارات الذكية الأكثر مبيعاً! 🎧🕶️

المميزات:
✅ استماع للموسيقى بجودة صوت سينمائية.
✅ ميكروفون مدمج عالي الدقة للمكالمات أثناء السياقة.
✅ حماية 100% من الأشعة فوق البنفسجية (UV400).
✅ بطارية تدوم حتى 5 ساعات من الاستخدام المتواصل.
✅ تصميم خفيف وأنيق يناسب الجميع.

🚚 التوصيل مجاني لجميع المدن المغربية.
💰 الدفع عند الاستلام بعد معاينة المنتج.`,
    features: [
      "صوت ستيريو عالي الجودة",
      "بلوتوث 5.0 لاتصال سريع",
      "مقاومة للتعرق والرذاذ",
      "متوافقة مع جميع الهواتف"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1509100104048-637d78553bc9?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'ultra-watch-series-8',
    title: 'ساعة Ultra Smart Watch - الإصدار الرياضي الفاخر',
    price: 299,
    oldPrice: 499,
    category: Category.ELECTRONICS,
    description: `الساعة الأكثر طلباً في المغرب متوفرة الآن! ⌚🔥

المميزات:
✅ شاشة AMOLED كبيرة وواضحة جداً.
✅ قياس نبضات القلب، الأكسجين، والضغط.
✅ تدعم جميع الأنشطة الرياضية.
✅ إشعارات جميع التطبيقات (واتساب، فيسبوك...).
✅ إجراء المكالمات مباشرة من الساعة.

🎁 شحن مجاني + ضمان لمدة سنة.`,
    features: [
      "شاشة مقاومة للخدش",
      "بطارية قوية تدوم 10 أيام",
      "مقاومة للماء بمعيار IP68",
      "تطبيق خاص باللغة العربية"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544117518-2b461f58ad02?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1508685096489-7aac291253f6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'car-vacuum-cleaner-turbo',
    title: 'منظف السيارة اللاسلكي Turbo - قوة شفط جبارة',
    price: 249,
    oldPrice: 399,
    category: Category.CAR_ACCESSORIES,
    description: `حافظ على نظافة سيارتك في ثوانٍ مع المكنسة اللاسلكية العجيبة! 🚗✨

المميزات:
✅ شفط قوي جداً للأتربة والأوساخ الصعبة.
✅ لاسلكية تماماً، اشحنها واستخدمها في أي مكان.
✅ تأتي مع رؤوس مختلفة للوصول للأماكن الضيقة.
✅ فلتر قابل للغسل وإعادة الاستخدام.

🚚 التوصيل سريع جداً (24-48 ساعة).`,
    features: [
      "محرك تربو بقوة 120 واط",
      "تصميم مريح وسهل الحمل",
      "إضاءة LED مدمجة للأماكن المظلمة",
      "شحن عبر USB"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1518113199103-677d20779743?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

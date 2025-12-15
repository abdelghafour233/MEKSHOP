import { Product, Category } from './types';

// Replace with your actual Pixel ID
export const FACEBOOK_PIXEL_ID = '1234567890'; 

export const PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'e1',
    title: 'سماعات بلوتوث برو العازلة للضوضاء',
    price: 299,
    oldPrice: 450,
    category: Category.ELECTRONICS,
    description: 'استمتع بتجربة صوتية لا مثيل لها مع سماعات بلوتوث برو. تصميم مريح، بطارية تدوم طويلاً، وعزل ضوضاء فائق.',
    features: ['عزل ضوضاء نشط', 'بطارية 24 ساعة', 'مقاومة للماء IPX4', 'مايكروفون عالي الجودة'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e2',
    title: 'ساعة ذكية رياضية متطورة',
    price: 350,
    oldPrice: 600,
    category: Category.ELECTRONICS,
    description: 'تابع نشاطك الرياضي وصحتك بدقة عالية. شاشة AMOLED وقياس نبضات القلب.',
    features: ['قياس الأكسجين في الدم', 'تتبع النوم', 'مقاومة للماء 5ATM', 'أكثر من 100 وضع رياضي'],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e3',
    title: 'باور بانك 20000 ميلي أمبير',
    price: 199,
    category: Category.ELECTRONICS,
    description: 'شاحن متنقل قوي وسريع لشحن جميع أجهزتك أثناء التنقل.',
    features: ['شحن سريع PD', 'منفذين USB', 'حماية من الحرارة الزائدة'],
    imageUrl: 'https://images.unsplash.com/photo-1609592424369-37e44c20b4d4?auto=format&fit=crop&w=800&q=80',
  },

  // Home
  {
    id: 'h1',
    title: 'طقم أواني طهي جرانيت 7 قطع',
    price: 899,
    oldPrice: 1200,
    category: Category.HOME,
    description: 'طقم أواني فاخر غير قابل للالتصاق، صحي وسهل التنظيف لمطبخ عصري.',
    features: ['طلاء جرانيت 5 طبقات', 'توزيع حراري ممتاز', 'أغطية زجاجية حرارية'],
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h2',
    title: 'مكواة بخار عمودية احترافية',
    price: 450,
    category: Category.HOME,
    description: 'احصل على ملابس خالية من التجاعيد في دقائق مع مكواة البخار القوية.',
    features: ['خزان مياه كبير', 'تسخين سريع في 30 ثانية', 'مناسبة لجميع الأقمشة'],
    imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65be1bac6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h3',
    title: 'خلاط كهربائي متعدد الوظائف',
    price: 320,
    oldPrice: 400,
    category: Category.HOME,
    description: 'خلاط قوي لتحضير العصائر والشوربات والصلصات بكل سهولة.',
    features: ['شفرات ستانلس ستيل', 'دورق زجاجي قوي', 'سرعات متعددة'],
    imageUrl: 'https://images.unsplash.com/photo-1589635999813-f66d40078021?auto=format&fit=crop&w=800&q=80',
  },

  // Cars (Accessories)
  {
    id: 'c1',
    title: 'مكنسة سيارة محمولة قوية',
    price: 150,
    oldPrice: 250,
    category: Category.CARS,
    description: 'حافظ على نظافة سيارتك مع هذه المكنسة القوية والمحمولة.',
    features: ['شفط قوي', 'ملحقات متعددة للأماكن الضيقة', 'سلك طويل 5 متر'],
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c2',
    title: 'شاشة سيارة أندرويد 9 بوصة',
    price: 1200,
    oldPrice: 1600,
    category: Category.CARS,
    description: 'حول سيارتك إلى سيارة ذكية مع شاشة لمس ونظام ملاحة.',
    features: ['بلوتوث وواي فاي', 'GPS مدمج', 'تدعم الكاميرا الخلفية'],
    imageUrl: 'https://images.unsplash.com/photo-1616423662038-a28892224d45?auto=format&fit=crop&w=800&q=80',
  },
   {
    id: 'c3',
    title: 'منظم مقعد السيارة الخلفي',
    price: 99,
    category: Category.CARS,
    description: 'نظم أغراضك وأغراض أطفالك في السيارة بشكل مرتب وأنيق.',
    features: ['جيوب متعددة', 'حامل تابلت', 'جلد عالي الجودة'],
    imageUrl: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80',
  },
];
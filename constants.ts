
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
    additionalImages: [],
  },
  // Watches
  {
    id: 'w1',
    title: 'ساعة رجالية كلاسيكية فاخرة',
    price: 499,
    oldPrice: 800,
    category: Category.WATCHES,
    description: 'ساعة يد أنيقة بتصميم كلاسيكي يناسب جميع المناسبات الرسمية واليومية.',
    features: ['جلد طبيعي', 'مقاومة للماء', 'حركة كوارتز دقيقة'],
    imageUrl: 'https://images.unsplash.com/photo-1524592091214-8f97ad762c93?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
  },
  // Car Accessories
  {
    id: 'c1',
    title: 'مكنسة سيارة محمولة قوية',
    price: 150,
    oldPrice: 250,
    category: Category.CAR_ACCESSORIES,
    description: 'حافظ على نظافة سيارتك مع هذه المكنسة القوية والمحمولة.',
    features: ['شفط قوي', 'ملحقات متعددة للأماكن الضيقة', 'سلك طويل 5 متر'],
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
  },
  // Glasses
  {
    id: 'g1',
    title: 'نظارات شمسية عصرية مستقطبة',
    price: 220,
    oldPrice: 350,
    category: Category.GLASSES,
    description: 'حماية كاملة لعينيك مع تصميم عصري وأنيق يتناسب مع جميع الوجوه.',
    features: ['عدسات مستقطبة', 'حماية UV400', 'إطار خفيف الوزن'],
    imageUrl: 'https://images.unsplash.com/photo-1511499767390-90342f16b117?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
  },
  // Other
  {
    id: 'o1',
    title: 'مجموعة العناية الشخصية المتكاملة',
    price: 180,
    category: Category.OTHER,
    description: 'كل ما تحتاجه للعناية اليومية في حقيبة واحدة أنيقة وعملية.',
    features: ['مواد طبيعية', 'سهلة الحمل', 'هدية مثالية'],
    imageUrl: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
  },
];

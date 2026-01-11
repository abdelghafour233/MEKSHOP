
import { Product, Category } from './types';

export const FACEBOOK_PIXEL_ID = '1234567890'; 

/**
 * قائمة المنتجات الدائمة.
 * ملاحظة للمستخدم: لإضافة منتجاتك هنا، انسخ "كود المتجر" من لوحة التحكم وأرسله لي.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'prod-1768096074677',
    title: 'ساعة Ultra الذكية - الإصدار الرياضي الفاخر 2025',
    price: 349,
    oldPrice: 599,
    category: Category.WATCHES,
    description: 'استمتع بأحدث تكنولوجيا الساعات الذكية مع ساعة Ultra الجديدة. \n\nالمميزات الرئيسية:\n- شاشة Retina AMOLED فائقة الوضوح.\n- هيكل من التيتانيوم المقاوم للصدأ والخدش.\n- بطارية تدوم حتى 5 أيام من الاستخدام المتواصل.\n- تدعم جميع تطبيقات التواصل الاجتماعي والمكالمات.\n- مقاومة للماء بمعيار IP68.',
    features: [
      'شاشة 2.02 بوصة عالية الدقة',
      'قياس نبضات القلب والأكسجين',
      'دعم المكالمات بلوتوث بصوت نقي',
      'أكثر من 100 وضع رياضي مختلف'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544117518-2b44c8ad2185?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

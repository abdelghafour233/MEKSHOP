
import { Product, Category } from './types';

export const FACEBOOK_PIXEL_ID = '1234567890'; 
export const WHATSAPP_NUMBER = '212688775968';

/**
 * قائمة المنتجات الدائمة.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'smart-glasses-official-v10',
    title: 'نظارات ذكية بلوتوث - موسيقى ومكالمات لاسلكية',
    price: 199,
    oldPrice: 299,
    category: Category.GLASSES,
    description: `واش كتحب تسمع الموسيقى وانت كتمشي فالمدينة أو فالطريق؟ 🎶🚗

مع هاد النظارات، تقدر:
🎧 تستمع للموسيقى مباشرة من التليفون بجودة صوت واضحة
📞 تجاوب على المكالمات بلا ما تشد الهاتف
👓 يدك فالفولان وانت مرتاح وآمن
💡 خفيفة وسهلة الاستعمال مع أي تليفون
🔁 ضمان استبدال 7 أيام
🚚 التوصيل لجميع المدن
💰 الدفع عند الاستلام

اطلبها دابا وخلي الموسيقى والمكالمات أسهل أثناء القيادة أو الحركة اليومية.
“منتج عالي الجودة ⭐⭐⭐⭐⭐، تجربة ممتازة لجميع السائقين ومحبي الموسيقى والمكالمات بسهولة وراحة”`,
    features: [
      "استماع للموسيقى بجودة صوت واضحة",
      "إجراء واستقبال المكالمات لاسلكياً",
      "حماية العين وتصميم عصري للجنسين",
      "بطارية تدوم طويلاً وشحن سريع",
      "متوافقة مع أندرويد و آيفون (Bluetooth)"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1509100104048-637d78553bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767390-90342f16b147?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

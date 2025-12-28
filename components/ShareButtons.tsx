
import React from 'react';
import { Facebook, Twitter, Send, Pinterest, Link as LinkIcon, Instagram } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  image?: string;
  variant?: 'large' | 'small' | 'minimal' | 'grid';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, image, variant = 'large' }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`اكتشف هذا المنتج الرائع في berrima store: ${title}`);
  const encodedImage = image ? encodeURIComponent(image) : '';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={variant === 'minimal' ? 16 : 20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]',
      hover: 'hover:bg-[#166fe5]',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={variant === 'minimal' ? 16 : 20} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2]',
      hover: 'hover:bg-[#1a91da]',
    },
    {
      name: 'WhatsApp',
      icon: <Send size={variant === 'minimal' ? 16 : 20} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
      hover: 'hover:bg-[#20bd5a]',
    },
    {
      name: 'Pinterest',
      icon: <Pinterest size={variant === 'minimal' ? 16 : 20} />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      color: 'bg-[#BD081C]',
      hover: 'hover:bg-[#a8071a]',
    },
  ];

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنتج بنجاح! يمكنك الآن لصقه في إنستغرام أو أي تطبيق آخر.');
  };

  if (variant === 'minimal') {
    return (
      <div className="flex gap-2 items-center">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded-lg text-white transition-all transform hover:scale-110 shadow-md ${link.color} ${link.hover}`}
            title={`شارك على ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white transition-all transform hover:scale-110 shadow-md"
          title="مشاركة على إنستغرام"
        >
          <Instagram size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
        <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em]">شارك العرض مع أصدقائك</p>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-black text-sm transition-all transform hover:scale-105 shadow-xl ${link.color} ${link.hover}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-black text-sm transition-all transform hover:scale-105 shadow-xl"
        >
          <Instagram size={20} />
          <span>Instagram</span>
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-black text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-xl"
        >
          <LinkIcon size={20} />
          <span>نسخ الرابط</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

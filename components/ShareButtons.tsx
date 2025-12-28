
import React from 'react';
import { Facebook, Twitter, Send, Pinterest, Link as LinkIcon, Instagram } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  image?: string;
  variant?: 'large' | 'minimal';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, image, variant = 'large' }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`اكتشف هذا المنتج الرائع في berrima store: ${title}`);
  const encodedImage = image ? encodeURIComponent(image) : '';

  const shareLinks = [
    {
      name: 'واتساب',
      icon: <Send size={variant === 'minimal' ? 14 : 20} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
    },
    {
      name: 'فيسبوك',
      icon: <Facebook size={variant === 'minimal' ? 14 : 20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]',
    },
    {
      name: 'تويتر',
      icon: <Twitter size={variant === 'minimal' ? 14 : 20} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2]',
    },
  ];

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنتج! شاركه الآن مع أصدقائك.');
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
            className={`flex items-center justify-center w-8 h-8 rounded-full text-white shadow-lg transition-transform hover:scale-125 ${link.color}`}
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-lg transition-transform hover:scale-125"
          title="Instagram / Copy Link"
        >
          <Instagram size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <p className="text-[11px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">شارك هذا المنتج</p>
        <div className="h-px w-full bg-slate-200 dark:bg-white/10"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-sm transition-all transform hover:-translate-y-1 shadow-xl ${link.color}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-black text-sm transition-all transform hover:-translate-y-1 shadow-xl"
        >
          <Instagram size={20} />
          <span>إنستغرام</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

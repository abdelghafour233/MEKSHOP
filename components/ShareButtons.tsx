
import React from 'react';
import { Facebook, Twitter, Send, Pinterest, Link as LinkIcon, Instagram } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  image?: string;
  variant?: 'large' | 'small' | 'minimal';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, image, variant = 'large' }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`اكتشف هذا المنتج الرائع في berrima store: ${title}`);
  const encodedImage = image ? encodeURIComponent(image) : '';

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <Send size={variant === 'minimal' ? 14 : 18} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={variant === 'minimal' ? 14 : 18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={variant === 'minimal' ? 14 : 18} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2]',
    },
    {
      name: 'Pinterest',
      icon: <Pinterest size={variant === 'minimal' ? 14 : 18} />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      color: 'bg-[#BD081C]',
    },
  ];

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنتج! يمكنك مشاركته الآن على Instagram.');
  };

  if (variant === 'minimal') {
    return (
      <div className="flex gap-1.5 items-center">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-white shadow-md transform hover:scale-110 transition-all ${link.color}`}
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-md transform hover:scale-110 transition-all"
          title="Instagram (Copy Link)"
        >
          <Instagram size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em] whitespace-nowrap">شارك هذا المنتج</span>
        <div className="h-px w-full bg-slate-100 dark:bg-white/10"></div>
      </div>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-white font-black text-xs transition-all transform hover:-translate-y-1 shadow-lg ${link.color}`}
          >
            {link.icon}
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-black text-xs transition-all transform hover:-translate-y-1 shadow-lg"
        >
          <Instagram size={18} />
          <span className="hidden sm:inline">Instagram</span>
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 text-white font-black text-xs transition-all transform hover:-translate-y-1 shadow-lg"
        >
          <LinkIcon size={18} />
          <span className="hidden sm:inline">نسخ الرابط</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

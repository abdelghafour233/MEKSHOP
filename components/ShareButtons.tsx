
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
      name: 'Facebook',
      icon: <Facebook size={variant === 'minimal' ? 14 : variant === 'large' ? 20 : 16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]',
      hover: 'hover:shadow-[#1877F2]/40',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={variant === 'minimal' ? 14 : variant === 'large' ? 20 : 16} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2]',
      hover: 'hover:shadow-[#1DA1F2]/40',
    },
    {
      name: 'WhatsApp',
      icon: <Send size={variant === 'minimal' ? 14 : variant === 'large' ? 20 : 16} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
      hover: 'hover:shadow-[#25D366]/40',
    },
    {
      name: 'Pinterest',
      icon: <Pinterest size={variant === 'minimal' ? 14 : variant === 'large' ? 20 : 16} />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      color: 'bg-[#BD081C]',
      hover: 'hover:shadow-[#BD081C]/40',
    },
  ];

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنتج بنجاح!');
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
            className={`p-1.5 rounded-md text-white/80 hover:text-white transition-all transform hover:scale-110 ${link.color}`}
            title={`شارك على ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="flex gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2.5 rounded-xl text-white transition-all transform hover:scale-110 shadow-lg ${link.color} ${link.hover}`}
            title={`شارك على ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
        <p className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.3em]">شارك هذا المنتج</p>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-white font-black text-sm transition-all transform hover:scale-105 shadow-xl ${link.color} ${link.hover}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-black text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl"
        >
          <LinkIcon size={20} />
          <span>نسخ الرابط</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

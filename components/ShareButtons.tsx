
import React from 'react';
import { Facebook, Twitter, Instagram, Send, Pinterest, Link as LinkIcon } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  image?: string;
  variant?: 'large' | 'small';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, image, variant = 'large' }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`اكتشف هذا المنتج الرائع في berrima store: ${title}`);
  const encodedImage = image ? encodeURIComponent(image) : '';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={variant === 'large' ? 20 : 16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]',
      hover: 'hover:shadow-[#1877F2]/40',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={variant === 'large' ? 20 : 16} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1DA1F2]',
      hover: 'hover:shadow-[#1DA1F2]/40',
    },
    {
      name: 'WhatsApp',
      icon: <Send size={variant === 'large' ? 20 : 16} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
      hover: 'hover:shadow-[#25D366]/40',
    },
    {
      name: 'Pinterest',
      icon: <Pinterest size={variant === 'large' ? 20 : 16} />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      color: 'bg-[#BD081C]',
      hover: 'hover:shadow-[#BD081C]/40',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنتج بنجاح!');
  };

  if (variant === 'small') {
    return (
      <div className="flex gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg text-white transition-all transform hover:scale-110 shadow-lg ${link.color} ${link.hover}`}
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
      <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">شارك المنتج مع أصدقائك</p>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-black text-sm transition-all transform hover:scale-105 shadow-xl ${link.color} ${link.hover}`}
          >
            {link.icon}
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/10 font-black text-sm hover:bg-white/20 transition-all shadow-xl"
        >
          <LinkIcon size={20} />
          <span className="hidden sm:inline">نسخ الرابط</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

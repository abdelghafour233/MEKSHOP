
import React, { useState } from 'react';
import { Facebook, Twitter, Send, Link as LinkIcon, Instagram, Check, Copy } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  image?: string;
  variant?: 'large' | 'minimal';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, image, variant = 'large' }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`اكتشف هذا المنتج الرائع في berrima store: ${title}`);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Copy Link Icon Button */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-white shadow-lg transition-all hover:scale-125 ${copied ? 'bg-green-500' : 'bg-slate-700'}`}
          title="نسخ الرابط"
        >
          {copied ? <Check size={14} /> : <LinkIcon size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
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
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        ))}
        
        {/* Instagram Button Large */}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-black text-sm transition-all transform hover:-translate-y-1 shadow-xl"
        >
          <Instagram size={20} />
          <span className="hidden sm:inline">إنستغرام</span>
        </button>
      </div>

      {/* Direct Link Copy Bar - New Feature */}
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[24px] p-2 flex items-center gap-2 shadow-inner group">
        <div className="flex-1 px-4 overflow-hidden">
          <p className="text-slate-400 dark:text-gray-500 text-xs font-mono truncate" dir="ltr">{url}</p>
        </div>
        <button
          onClick={copyToClipboard}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg ${copied ? 'bg-green-500 text-white dark:text-black' : 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-black'}`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

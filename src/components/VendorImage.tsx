import React, { useEffect, useState } from 'react';
import {
  Building2,
  Camera,
  ClipboardList,
  Flower2,
  Globe,
  HeartHandshake,
  Music,
  Palette,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Vendor, VendorCategory } from '../types';

const CATEGORY_ICON_MAP: Record<VendorCategory, React.ElementType> = {
  Photographers: Camera,
  Planners: ClipboardList,
  Caterers: UtensilsCrossed,
  Florists: Flower2,
  'Makeup Artists': Sparkles,
  'Cultural Specialists': Globe,
  'Entertainment & DJs': Music,
  'Venues & Marquees': Building2,
  'Decor & Styling': Palette,
  'Proposal & Elopement': HeartHandshake,
};

interface VendorImageProps {
  vendor: Pick<Vendor, 'businessName' | 'category' | 'image' | 'imageAlt'>;
  variant?: 'card' | 'thumb' | 'avatar';
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  decorative?: boolean;
  offsetBottomForOverlay?: boolean;
}

export const VendorImage: React.FC<VendorImageProps> = ({
  vendor,
  variant = 'card',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  decorative = false,
  offsetBottomForOverlay = false,
}) => {
  const Icon = CATEGORY_ICON_MAP[vendor.category] || Sparkles;
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setHasFailed(false);
  }, [vendor.image]);

  if (vendor.image && !hasFailed) {
    return (
      <img
        src={vendor.image}
        alt={decorative ? '' : vendor.imageAlt}
        className={imgClassName || className || 'w-full h-full object-cover'}
        referrerPolicy="no-referrer"
        loading={loading}
        onError={() => setHasFailed(true)}
      />
    );
  }

  if (variant === 'avatar') {
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : vendor.imageAlt}
        title={vendor.businessName}
        className={`flex items-center justify-center bg-[#F2CCC3] text-[#724319] ${className}`}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
    );
  }

  if (variant === 'thumb') {
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : vendor.imageAlt}
        title={vendor.businessName}
        className={`flex flex-col items-center justify-center gap-0.5 bg-[#F2CCC3]/65 text-[#724319] p-1 text-center select-none ${className}`}
      >
        <Icon className="w-4 h-4 text-[#8A5A44] shrink-0" aria-hidden="true" />
        <span className="text-[8.5px] font-serif font-bold leading-tight line-clamp-2 text-[#724319]">
          {vendor.businessName}
        </span>
      </div>
    );
  }

  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : vendor.imageAlt}
      className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-[#F2CCC3]/60 text-[#724319] px-6 text-center select-none ${
        offsetBottomForOverlay ? 'pb-14 pt-6' : 'py-8'
      } ${className}`}
    >
      <div className="w-11 h-11 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#8A5A44] shadow-2xs shrink-0">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <span className="font-serif font-bold text-sm sm:text-base text-[#724319] leading-snug max-w-[260px] line-clamp-2">
        {vendor.businessName}
      </span>
    </div>
  );
};

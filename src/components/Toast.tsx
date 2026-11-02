import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#724319] text-white p-4 rounded-2xl shadow-xl border border-[#EBC1B6] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <CheckCircle2 className="w-5 h-5 text-[#EBC1B6] shrink-0" />
      <span className="text-xs font-medium leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer ml-auto"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

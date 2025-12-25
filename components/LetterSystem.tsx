
import React, { useState, useEffect, useRef } from 'react';
import { getRandomBlessing } from '../utils/blessings';
import { Language, BlessingContent } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const UI_TEXT = {
  en: { gift: "A GIFT FOR YOU", wisdom: "Festive Wisdom", message: "Celestial Message", footer: "Merry Christmas 2025", close: "Accept Blessing", hint: "Tap background to return" },
  cn: { gift: "赠予你的礼物", wisdom: "节日智慧", message: "星空密语", footer: "圣诞快乐 2025", close: "收下祝福", hint: "点击背景返回主页" }
};

const LetterSystem: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const [blessing, setBlessing] = useState<BlessingContent | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const t = UI_TEXT[language];

  useEffect(() => {
    if (isOpen) {
      setBlessing(getRandomBlessing());
      const timer = setTimeout(() => setIsOpening(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsOpening(false);
    }
  }, [isOpen]);

  if (!isOpen || !blessing) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[100] bg-black/85 backdrop-blur-2xl transition-opacity duration-700 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className={`relative w-[340px] h-56 perspective-[1500px] transition-all duration-1000 transform cursor-default ${isOpening ? 'scale-100 translate-y-32' : 'scale-0 translate-y-0'}`}
        ref={envelopeRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className={`absolute inset-0 bg-[#8b1e1e] border-2 border-[#d4af37] rounded-sm shadow-2xl transition-transform duration-700 delay-300 preserve-3d ${isOpening ? 'rotate-x-0' : 'rotate-x-[-15deg]'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-[#721919] rounded-sm" />
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-[#d4af37] font-cinzel z-20 pointer-events-none transition-opacity duration-500 ${isOpening ? 'opacity-20' : 'opacity-100'}`}>
            <div className="text-lg mb-1 tracking-[0.2em] font-bold uppercase">{t.gift}</div>
            <div className="text-[9px] opacity-70 mb-4 uppercase tracking-[0.3em]">{t.wisdom}</div>
            <div className="w-16 h-16 border border-[#d4af37]/40 rounded-full flex items-center justify-center text-4xl bg-[#d4af37]/5 animate-pulse">🎁</div>
          </div>
          <div 
            className={`absolute top-0 left-0 w-full h-1/2 bg-[#a12323] origin-top border-b-2 border-[#d4af37]/40 transition-transform duration-700 z-30 ${isOpening ? 'rotate-x-180' : 'rotate-x-0'}`}
            style={{ backfaceVisibility: 'hidden' }}
          />
          <div 
            className={`absolute left-3 right-3 bg-[#fdfaf0] px-6 py-8 shadow-2xl rounded-sm border border-[#d4af37]/30 transition-all duration-1000 cubic-bezier(0.175, 0.885, 0.32, 1.1) ${isOpening ? 'translate-y-[-240px] opacity-100 z-40 scale-105' : 'translate-y-0 opacity-0 z-10'}`}
            style={{ minHeight: '260px' }}
          >
            <div className="text-[#8b1e1e] font-serif flex flex-col h-full items-center text-center">
              <div className="text-[10px] font-bold mb-4 font-cinzel text-[#d4af37] tracking-[0.25em] border-b border-[#d4af37]/20 pb-2 w-full uppercase">
                {t.message}
              </div>
              <div className="flex-grow flex items-center justify-center px-1 py-4">
                <p className={`leading-relaxed italic text-gray-900 font-medium ${language === 'cn' ? 'text-[17px]' : 'text-[14px]'}`}>
                  "{blessing[language]}"
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#d4af37]/10 w-full">
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#d4af37] font-cinzel opacity-80">{t.footer}</p>
              </div>
              <button 
                onClick={onClose}
                className="mt-6 w-full py-2.5 text-[9px] bg-[#8b1e1e] text-[#d4af37] border border-[#d4af37]/50 rounded-sm uppercase font-cinzel tracking-[0.3em] hover:bg-[#a12323] hover:text-white transition-all shadow-lg active:scale-95"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#d4af37]/50 text-[10px] tracking-[0.4em] font-cinzel uppercase animate-pulse">{t.hint}</div>
    </div>
  );
};

export default LetterSystem;

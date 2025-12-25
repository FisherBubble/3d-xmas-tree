
import React, { useState } from 'react';
import { Language } from '../types';

interface Props {
  language: Language;
  onLanguageToggle: () => void;
}

const UI_TEXT = {
  en: {
    guide: "OPERATING GUIDE",
    fist: "FIST (TREE)",
    fistDesc: "Form the Christmas Tree.",
    open: "OPEN HAND (SCATTER)",
    openDesc: "Scatter energy & stars.",
    heart: "2-HAND HEART (MAGIC)",
    heartDesc: "Unlock celestial blessings.",
  },
  cn: {
    guide: "操作指南",
    fist: "握拳 (形如树)",
    fistDesc: "聚集成璀璨圣诞树。",
    open: "张手 (散若星)",
    openDesc: "散开粒子系统。",
    heart: "双手比心 (魔法)",
    heartDesc: "解锁星空密语。",
  }
};

export const Instructions: React.FC<Props> = ({ language, onLanguageToggle }) => {
  const [expanded, setExpanded] = useState(true);
  const t = UI_TEXT[language];

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3">
      <button 
        onClick={onLanguageToggle}
        className="w-12 h-12 bg-black/60 border border-[#d4af37]/30 rounded-full text-[#d4af37] font-cinzel text-xs flex items-center justify-center hover:bg-[#d4af37]/20 transition-all backdrop-blur-sm"
      >
        {language === 'en' ? '中' : 'EN'}
      </button>

      <div className={`bg-black/60 border border-[#d4af37]/30 rounded-lg backdrop-blur-sm overflow-hidden transition-all duration-500 ${expanded ? 'max-h-96 w-64' : 'max-h-12 w-48'}`}>
        <div className="p-3 flex justify-between items-center bg-[#d4af37]/10 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <span className="font-cinzel text-[10px] tracking-widest text-[#d4af37]">{t.guide}</span>
          <span className="text-[10px]">{expanded ? '▾' : '▴'}</span>
        </div>
        
        {expanded && (
          <div className="p-4 space-y-4 text-[11px] text-[#d4af37]/80">
            <div className="flex items-center gap-3">
              <span className="text-lg">✊</span>
              <div>
                <p className="font-bold">{t.fist}</p>
                <p>{t.fistDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🖐️</span>
              <div>
                <p className="font-bold">{t.open}</p>
                <p>{t.openDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🫶</span>
              <div>
                <p className="font-bold">{t.heart}</p>
                <p>{t.heartDesc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import ThreeScene from './components/ThreeScene';
import HandTracker from './components/HandTracker';
import LetterSystem from './components/LetterSystem';
import { Instructions } from './components/UIPanels';
import { HandData, GestureType, Language } from './types';
import { detectTwoHandHeart } from './utils/gestureLogic';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [handsData, setHandsData] = useState<HandData[]>([]);
  const [showLetter, setShowLetter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gesture accumulation logic
  const [gestureHoldCount, setGestureHoldCount] = useState(0);
  const [activeGesture, setActiveGesture] = useState<GestureType>(GestureType.NONE);
  // Using a smaller threshold for state switching to feel more "magical"
  const TRIGGER_THRESHOLD = 5; 

  const startExperience = async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 640 },
          height: { ideal: 480 } 
        }, 
        audio: false 
      });
      setMediaStream(stream);
      setHasStarted(true);
      setLoading(false);
    } catch (err) {
      console.error("Camera access denied:", err);
      const msg = language === 'en' 
        ? "Camera access is required. Please ensure you are on HTTPS and granted permissions." 
        : "需要摄像头权限。请确保使用 HTTPS 并已授予访问权限。";
      setError(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasStarted) return;

    let currentGesture = GestureType.NONE;

    // 1. Check for Two-Hand Heart first (highest priority)
    if (handsData.length === 2) {
      const isTwoHandHeart = detectTwoHandHeart(handsData.map(h => h.landmarks));
      if (isTwoHandHeart) {
        currentGesture = GestureType.HEART;
      }
    }

    // 2. If no two-hand gesture, check individual hand gestures
    if (currentGesture === GestureType.NONE && handsData.length > 0) {
      // Find if ANY hand is doing a specific gesture
      const detected = handsData.find(h => h.gesture !== GestureType.NONE);
      currentGesture = detected ? detected.gesture : GestureType.NONE;
    }

    // Accumulation logic to prevent flickering
    if (currentGesture === activeGesture) {
      if (currentGesture !== GestureType.NONE) {
        setGestureHoldCount(prev => {
          const next = prev + 1;
          if (next >= TRIGGER_THRESHOLD) {
            handleGestureTrigger(activeGesture);
            return 0; 
          }
          return next;
        });
      }
    } else {
      setActiveGesture(currentGesture);
      setGestureHoldCount(1);
    }
  }, [handsData, activeGesture, hasStarted]);

  const handleGestureTrigger = (gesture: GestureType) => {
    switch (gesture) {
      case GestureType.HEART:
        if (!showLetter) setShowLetter(true);
        break;
      case GestureType.TREE:
        if (showLetter) setShowLetter(false);
        break;
      default:
        break;
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.loop = true;
    }
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  };

  const primaryHand = handsData.length > 0 ? handsData[0] : null;

  if (!hasStarted && !loading && !error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[300] p-6 text-center">
        <div className="mb-12 animate-bounce text-6xl">🎄</div>
        <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] mb-6 tracking-[0.2em]">
          {language === 'en' ? 'ETHEREAL CHRISTMAS' : '灵动圣诞'}
        </h1>
        <p className="text-[#d4af37]/70 text-sm md:text-base max-w-md mb-12 font-light leading-relaxed">
          {language === 'en' 
            ? 'Step into a world of starlight. Use your hands to shape the tree and two-hand heart to unlock festive secrets.' 
            : '走进星光世界。用手势塑造圣诞树，双手比心解锁节日的秘密。'}
        </p>
        <button 
          onClick={startExperience}
          className="px-10 py-4 border-2 border-[#d4af37] text-[#d4af37] font-cinzel tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all duration-500 rounded-full group shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95"
        >
          {language === 'en' ? 'BEGIN CELEBRATION' : '开启庆典'}
        </button>
        <div className="mt-8">
           <button onClick={() => setLanguage(l => l === 'en' ? 'cn' : 'en')} className="text-[#d4af37]/40 text-xs font-cinzel hover:text-[#d4af37] transition-colors">
             {language === 'en' ? 'SWITCH TO CHINESE' : '切换至英文'}
           </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[200]">
        <div className="w-16 h-16 border-t-2 border-[#d4af37] rounded-full animate-spin mb-8"></div>
        <h1 className="font-cinzel text-xl text-[#d4af37] tracking-[0.5em] animate-pulse">
          {language === 'en' ? 'GATHERING STARS...' : '正在汇聚星光...'}
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[200] p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[#d4af37] font-cinzel mb-8 max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 border border-[#d4af37] text-[#d4af37] font-cinzel text-xs tracking-widest rounded-full">
          {language === 'en' ? 'RETRY' : '重试'}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black select-none overflow-hidden">
      <ThreeScene handData={primaryHand} />
      <HandTracker onHandsUpdate={setHandsData} stream={mediaStream} debug={true} />

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
        <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          {language === 'en' ? 'ETHEREAL CHRISTMAS' : '灵动圣诞'}
        </h1>
      </div>

      <div className="fixed top-8 left-8 z-40">
        <button onClick={toggleMusic} className="p-3 bg-white/5 border border-[#d4af37]/30 rounded-full hover:bg-[#d4af37]/20 transition-all backdrop-blur-sm shadow-xl">
          <span className="text-[#d4af37] text-xl block">{musicPlaying ? '🔊' : '🔇'}</span>
        </button>
      </div>

      <Instructions language={language} onLanguageToggle={() => setLanguage(l => l === 'en' ? 'cn' : 'en')} />
      <LetterSystem isOpen={showLetter} onClose={() => setShowLetter(false)} language={language} />
    </div>
  );
};

export default App;


import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandData, GestureType } from '../types';
import { detectGesture } from '../utils/gestureLogic';

interface Props {
  onHandsUpdate: (hands: HandData[]) => void;
  stream: MediaStream | null;
  debug?: boolean;
}

const HandTracker: React.FC<Props> = ({ onHandsUpdate, stream, debug = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const [modelLoading, setModelLoading] = useState(true);

  useEffect(() => {
    const setupLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2, // Enable 2 hand tracking
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        landmarkerRef.current = handLandmarker;
        setModelLoading(false);
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
      }
    };
    setupLandmarker();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
      };
    }
  }, [stream]);

  const drawSkeletons = (allLandmarks: any[][]) => {
    if (!canvasRef.current || !allLandmarks) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 4;

    allLandmarks.forEach((landmarks, index) => {
      ctx.strokeStyle = index === 0 ? '#d4af37' : '#ff4444';
      ctx.shadowColor = index === 0 ? 'rgba(212, 175, 55, 0.8)' : 'rgba(255, 68, 68, 0.8)';

      const connections = [
        [0,1,2,3,4], [0,5,6,7,8], [9,10,11,12], [13,14,15,16], [17,18,19,20], [0,5,9,13,17,0]
      ];

      connections.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(landmarks[path[0]].x * 160, landmarks[path[0]].y * 120);
        for(let i=1; i<path.length; i++) {
          ctx.lineTo(landmarks[path[i]].x * 160, landmarks[path[i]].y * 120);
        }
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      landmarks.forEach(lm => {
        ctx.beginPath();
        ctx.arc(lm.x * 160, lm.y * 120, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  const predictLoop = () => {
    if (videoRef.current && landmarkerRef.current && videoRef.current.readyState >= 2) {
      const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      
      if (results.landmarks && results.landmarks.length > 0) {
        const handsData: HandData[] = results.landmarks.map((landmarks, i) => ({
          gesture: detectGesture(landmarks),
          landmarks,
          isRightHand: results.handedness ? results.handedness[i][0].categoryName === 'Right' : true
        }));

        onHandsUpdate(handsData);
        if (debug) drawSkeletons(results.landmarks);
      } else {
        onHandsUpdate([]);
        if (debug && canvasRef.current) {
          canvasRef.current.getContext('2d')?.clearRect(0, 0, 160, 120);
        }
      }
    }
    requestRef.current = requestAnimationFrame(predictLoop);
  };

  useEffect(() => {
    if (!modelLoading && stream) {
      requestRef.current = requestAnimationFrame(predictLoop);
    }
  }, [modelLoading, stream]);

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="relative border border-[#d4af37]/40 rounded-lg overflow-hidden bg-black/70 backdrop-blur-md w-44 h-32 shadow-xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-60"
        />
        <canvas 
          ref={canvasRef} 
          width="160" 
          height="120" 
          className="absolute inset-0 w-full h-full scale-x-[-1] z-10" 
        />
        <div className="absolute bottom-1 right-2 text-[7px] text-[#d4af37] font-cinzel z-20 bg-black/80 px-2 py-0.5 rounded-full border border-[#d4af37]/30 tracking-widest uppercase">
          {modelLoading ? 'Initializing' : 'Dual-Vision Ready'}
        </div>
      </div>
    </div>
  );
};

export default HandTracker;


import { GestureType } from '../types';

const getDistance = (a: any, b: any) => {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + 
    Math.pow(a.y - b.y, 2) + 
    Math.pow(a.z - b.z, 2)
  );
};

export const detectTwoHandHeart = (handsLandmarks: any[][]): boolean => {
  if (handsLandmarks.length < 2) return false;

  const handA = handsLandmarks[0];
  const handB = handsLandmarks[1];

  const indexA = handA[8];
  const thumbA = handA[4];
  const indexB = handB[8];
  const thumbB = handB[4];

  const palmA = getDistance(handA[0], handA[9]);
  const palmB = getDistance(handB[0], handB[9]);
  const avgPalm = (palmA + palmB) / 2;

  const indexDist = getDistance(indexA, indexB);
  const thumbDist = getDistance(thumbA, thumbB);

  // High-precision check for two-hand heart
  return indexDist < avgPalm * 1.5 && thumbDist < avgPalm * 1.5;
};

export const detectGesture = (landmarks: any[]): GestureType => {
  if (!landmarks || landmarks.length < 21) return GestureType.NONE;

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexMcp = landmarks[5];
  const middleTip = landmarks[12];
  const middleMcp = landmarks[9];
  const ringTip = landmarks[16];
  const ringMcp = landmarks[13];
  const pinkyTip = landmarks[20];
  const pinkyMcp = landmarks[17];

  // Palm size is the distance from wrist to the base of the middle finger
  const palmSize = getDistance(wrist, middleMcp);

  // --- SCATTER (Open Hand) Detection with Voting System ---
  // We check how many fingers are significantly extended.
  // Using MCP to Tip distance is often more stable than Wrist to Tip for open palms.
  const fingerExtensions = [
    getDistance(indexTip, wrist) > palmSize * 1.9,
    getDistance(middleTip, wrist) > palmSize * 2.0,
    getDistance(ringTip, wrist) > palmSize * 1.9,
    getDistance(pinkyTip, wrist) > palmSize * 1.7
  ];

  const extendedCount = fingerExtensions.filter(Boolean).length;
  
  // If 3 out of 4 fingers are extended, we consider it a "Scatter"
  // This handles cases where one finger is obscured or tilted.
  if (extendedCount >= 3) return GestureType.SCATTER;

  // --- TREE (Fist) Detection ---
  // A fist is very distinct because all tips are close to their respective MCPs.
  const allCurled = 
    getDistance(indexTip, indexMcp) < palmSize * 0.8 &&
    getDistance(middleTip, middleMcp) < palmSize * 0.8 &&
    getDistance(ringTip, ringMcp) < palmSize * 0.8 &&
    getDistance(pinkyTip, pinkyMcp) < palmSize * 0.8;

  if (allCurled) return GestureType.TREE;

  return GestureType.NONE;
};

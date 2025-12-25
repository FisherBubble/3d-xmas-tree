
export enum GestureType {
  NONE = 'NONE',
  SCATTER = 'SCATTER', // Open hand
  TREE = 'TREE',       // Fist
  HEART = 'HEART'      // Two-Hand Heart (Confession)
}

export type Language = 'en' | 'cn';

export interface HandData {
  gesture: GestureType;
  landmarks: any[];
  isRightHand: boolean;
}

export interface BlessingContent {
  en: string;
  cn: string;
}


export interface Message {
  id: string;
  content: string;
}

export interface FloatingMessage extends Message {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  color: { bg: string; text: string };
  vx: number; // velocity x
  vy: number; // velocity y
  wiggleTime: number;
  nextWiggle: number;
}
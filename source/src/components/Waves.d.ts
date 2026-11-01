import type { CSSProperties } from 'react';
export interface WavesProps {
  lineColor?: string; accentColor?: string; backgroundColor?: string; lineStyle?: 'solid' | 'dashed';
  spacing?: number; lineWidth?: number; rotation?: number; amplitude?: number; scale?: number; twist?: number;
  speed?: number; variation?: number; mouseInteraction?: boolean; mouseRadius?: number; mouseStrength?: number;
  bounce?: number; returnDuration?: number; clickRipple?: boolean; intro?: boolean; fade?: number; opacity?: number;
  lightMode?: boolean; paused?: boolean; dpr?: number; className?: string; style?: CSSProperties;
}
export default function Waves(props: WavesProps): React.JSX.Element;

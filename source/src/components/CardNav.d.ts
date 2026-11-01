import type { CSSProperties, ReactNode } from 'react';
export interface CardNavLink { label: string; href?: string; ariaLabel?: string }
export interface CardNavItem { label: string; description?: string; bgColor?: string; textColor?: string; links: CardNavLink[] }
export interface CardNavProps {
  logo?: string | ReactNode;
  logoAlt?: string;
  logoHref?: string;
  navigation?: ReactNode;
  items: CardNavItem[];
  cta?: { label: string; href?: string; onClick?: () => void };
  theme?: 'dark' | 'light'; surface?: 'glass' | 'solid';
  cardEffect?: 'rise' | 'unfold' | 'fade'; openOn?: 'click' | 'hover';
  stagger?: number; bounce?: number; speed?: number; cardHeight?: number; maxWidth?: number;
  accentColor?: string; menuLabel?: boolean; intro?: boolean; defaultOpen?: boolean;
  open?: boolean; onOpenChange?: (open: boolean) => void;
  onLinkClick?: (link: CardNavLink, item: CardNavItem) => void;
  ariaLabel?: string; className?: string; style?: CSSProperties;
  openLabel?: string; closeLabel?: string;
}
export default function CardNav(props: CardNavProps): React.JSX.Element;

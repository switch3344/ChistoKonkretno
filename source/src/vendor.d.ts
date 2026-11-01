declare module 'react-glass-zoom' {
  import type { FC, ReactElement } from 'react';
  const GlassZoom: FC<{ children: ReactElement; magnifierHeight?: number; magnifieWidth?: number; zoomLevel?: number }>;
  export default GlassZoom;
}

import React from 'react';
import { z } from 'zod';
import type { SloganFont } from './components/TextOverlay';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { MatrixGrid } from './components/MatrixGrid';
import { TextOverlay } from './components/TextOverlay';
import { SoundEffects } from './components/SoundEffects';
import { BG, GRID_PX, STEP, GAP, ORIGIN_ROW, SMALL_ROWS, VISIBLE_HEIGHT, ZOOM_IN, ZOOM_OUT, SCENE3_START, SCENE3_END } from './constants';

const CANVAS = 1080;

export const MatrixCompositionSchema = z.object({
  fontSize: z.number().int().min(8).max(200),
  whiteStroke: z.number().int().min(0).max(30),
  blackStroke: z.number().int().min(0).max(40),
  sloganFont: z.enum(['roboto', 'playfair', 'montserrat', 'oswald', 'raleway']),
  sloganFontSize: z.number().int().min(20).max(200),
  sloganTitleCase: z.boolean(),
  watermark: z.string(),
});

export const MatrixComposition: React.FC<z.infer<typeof MatrixCompositionSchema>> = ({
  fontSize, whiteStroke, blackStroke,
  sloganFont, sloganFontSize, sloganTitleCase,
  watermark,
}) => {
  const frame = useCurrentFrame();

  const zoomScale = interpolate(
    frame,
    [SCENE3_START, SCENE3_END - 15],
    [ZOOM_IN, ZOOM_OUT],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  // Production zone center within the clipped container
  const prodCenterY = ((ORIGIN_ROW + SMALL_ROWS) * STEP - GAP + ORIGIN_ROW * STEP) / 2; // 537.5
  const originYPct = (prodCenterY / VISIBLE_HEIGHT) * 100; // ~75.17%

  // Position container so production zone center sits at viewport center
  const offsetX = (CANVAS - GRID_PX) / 2;           // 2.5
  const offsetY = CANVAS / 2 - prodCenterY;          // 2.5

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div
        style={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: GRID_PX,
          height: VISIBLE_HEIGHT,
          overflow: 'hidden',
          transform: `scale(${zoomScale})`,
          transformOrigin: `50% ${originYPct}%`,
        }}
      >
        <MatrixGrid frame={frame} />
      </div>
      <TextOverlay
        frame={frame}
        fontSize={fontSize}
        whiteStroke={whiteStroke}
        blackStroke={blackStroke}
        sloganFont={sloganFont as SloganFont}
        sloganFontSize={sloganFontSize}
        sloganTitleCase={sloganTitleCase}
      />
      <SoundEffects />
      {watermark ? (
        <div style={{
          position: 'absolute',
          bottom: 6,
          right: 10,
          fontFamily: 'Roboto, system-ui, sans-serif',
          fontWeight: 400,
          fontSize: 26,
          color: '#000000',
          opacity: 0.4,
          pointerEvents: 'none',
          letterSpacing: '0.02em',
        }}>
          {watermark}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

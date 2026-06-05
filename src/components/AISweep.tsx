import React from 'react';
import { interpolate } from 'remotion';
import { GRID_PX, GRID_HEIGHT, SCENE4_START, SCENE4_END } from '../constants';

interface Props {
  frame: number;
}

export const AISweep: React.FC<Props> = ({ frame }) => {
  if (frame < SCENE4_START || frame > SCENE4_END + 10) return null;

  const progress = interpolate(frame, [SCENE4_START, SCENE4_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sweepPx = progress * GRID_PX;
  const beamW = GRID_PX * 0.14;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Trailing cleared zone — subtle cool tint */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: Math.max(0, sweepPx - beamW / 2),
          height: GRID_HEIGHT,
          background: 'rgba(150,220,180,0.06)',
        }}
      />
      {/* Beam */}
      <div
        style={{
          position: 'absolute',
          left: sweepPx - beamW / 2,
          top: 0,
          width: beamW,
          height: GRID_HEIGHT,
          background:
            'linear-gradient(to right, rgba(100,200,255,0) 0%, rgba(140,210,255,0.45) 35%, rgba(200,240,255,0.75) 50%, rgba(140,210,255,0.45) 65%, rgba(100,200,255,0) 100%)',
        }}
      />
    </div>
  );
};

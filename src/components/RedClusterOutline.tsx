import React from 'react';
import { interpolate } from 'remotion';
import { BOX, GAP, STEP, SCENE5_START, C_RED } from '../constants';

// Draws a subtle outline around the confirmed-red cluster for Scene 5
interface Props {
  frame: number;
}

// Confirmed red cells (large-grid coords): defect + 2 ripple neighbors
const CLUSTER: [number, number][] = [
  [8, 9],
  [8, 8],
  [9, 9],
];

export const RedClusterOutline: React.FC<Props> = ({ frame }) => {
  if (frame < SCENE5_START) return null;

  const opacity = interpolate(frame, [SCENE5_START, SCENE5_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rows = CLUSTER.map(([r]) => r);
  const cols = CLUSTER.map(([, c]) => c);
  const minR = Math.min(...rows);
  const maxR = Math.max(...rows);
  const minC = Math.min(...cols);
  const maxC = Math.max(...cols);

  const pad = GAP + 3;
  const x = minC * STEP - pad;
  const y = minR * STEP - pad;
  const w = (maxC - minC) * STEP + BOX + pad * 2;
  const h = (maxR - minR) * STEP + BOX + pad * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        border: `3px solid ${C_RED}`,
        borderRadius: 10,
        opacity,
        pointerEvents: 'none',
        boxShadow: `0 0 12px 3px rgba(224,53,53,0.25)`,
      }}
    />
  );
};

import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { BOX, STEP, C_GRAY, C_GREEN, C_RED, C_ORANGE } from '../constants';
import type { CellData } from '../types';
import { CardFlip } from './CardFlip';

interface Props {
  row: number;
  col: number;
  data: CellData;
  frame: number;
}

const FINAL_COLOR: Record<string, string> = {
  gray: C_GRAY,
  green: C_GREEN,
  red: C_RED,
  orange: C_ORANGE,
};

const SweepBar: React.FC<{ top: string }> = ({ top }) => (
  <div
    style={{
      position: 'absolute',
      left: 0, right: 0,
      top,
      height: '40%',
      background:
        'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
    }}
  />
);

const QuestionMark: React.FC = () => (
  <span
    style={{
      fontSize: Math.round(BOX * 0.52),
      fontWeight: 900,
      color: 'rgba(255,255,255,0.85)',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1,
      display: 'block',
    }}
  >
    ?
  </span>
);

export const Cell: React.FC<Props> = ({ row, col, data }) => {
  const { fps } = useVideoConfig();
  const { base, appearAge, pulseAge, sweepProgress, flipAge, colorFlipAge, isQuestion, endFadeOpacity } = data;

  if (base === 'empty') return null;

  const popScale = appearAge >= 0
    ? spring({ frame: appearAge, fps, from: 0, to: 1, config: { damping: 11, stiffness: 280, mass: 0.35 } })
    : 1;

  const phaseSeed = (row * 7 + col * 11) % 23;
  const phaseOffset = (phaseSeed / 23) * Math.PI * 2;
  const period = 10 + ((row * 3 + col * 7) % 6);
  const pulseScale = pulseAge >= 0
    ? 1 + 0.05 * Math.sin((pulseAge * Math.PI) / period + phaseOffset)
    : 1;

  const posStyle: React.CSSProperties = {
    position: 'absolute',
    left: col * STEP,
    top: row * STEP,
    width: BOX,
    height: BOX,
    opacity: endFadeOpacity,
    transform: `scale(${popScale * pulseScale})`,
    transformOrigin: 'center center',
  };

  const sweepTop = sweepProgress >= 0 ? `${sweepProgress * 120 - 20}%` : null;

  // Path 1: no flip active — settled render
  if (flipAge < 0 && colorFlipAge < 0) {
    return (
      <div
        style={{
          ...posStyle,
          backgroundColor: FINAL_COLOR[base] ?? C_GRAY,
          borderRadius: 7,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {sweepTop !== null && <SweepBar top={sweepTop} />}
        {isQuestion && <QuestionMark />}
      </div>
    );
  }

  // Path 2 & 3: 3D card flip
  const activeAge = flipAge >= 0 ? flipAge : colorFlipAge;
  const frontColor = flipAge >= 0 ? C_GRAY : C_GREEN;

  return (
    <div style={{ ...posStyle, perspective: `${BOX * 5}px` }}>
      <CardFlip
        flipAge={activeAge}
        frontColor={frontColor}
        backColor={FINAL_COLOR[base] ?? C_GRAY}
        frontContent={flipAge >= 0 && sweepTop !== null ? <SweepBar top={sweepTop} /> : undefined}
        backContent={isQuestion ? <QuestionMark /> : undefined}
      />
    </div>
  );
};

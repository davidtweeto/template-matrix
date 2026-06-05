import React from 'react';
import { interpolate, Easing } from 'remotion';
import { FLIP_FRAMES } from '../constants';

interface Props {
  flipAge: number;
  frontColor: string;
  backColor: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

const FLIP_EASING = Easing.bezier(0.4, 0, 0.2, 1);

function flipAngle(age: number): number {
  return interpolate(age, [0, FLIP_FRAMES], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: FLIP_EASING,
  });
}

export const CardFlip: React.FC<Props> = ({ flipAge, frontColor, backColor, frontContent, backContent }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transform: `rotateY(${flipAngle(flipAge)}deg)`,
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: frontColor,
        borderRadius: 7,
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
      }}
    >
      {frontContent}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: backColor,
        borderRadius: 7,
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {backContent}
    </div>
  </div>
);

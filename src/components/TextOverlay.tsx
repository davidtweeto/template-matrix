import React from 'react';
import { interpolate } from 'remotion';
import { loadFont as loadRoboto }      from '@remotion/google-fonts/Roboto';
import { loadFont as loadPlayfair }    from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadMontserrat }  from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOswald }      from '@remotion/google-fonts/Oswald';
import { loadFont as loadRaleway }     from '@remotion/google-fonts/Raleway';
import { C_TEXT, C_GREEN, C_RED, C_ORANGE, SCENE4_START, SCENE4_END } from '../constants';

const { fontFamily: roboto }     = loadRoboto('normal',     { weights: ['900'], subsets: ['latin'] });
const { fontFamily: playfair }   = loadPlayfair('normal',   { weights: ['700'], subsets: ['latin'] });
const { fontFamily: montserrat } = loadMontserrat('normal', { weights: ['800'], subsets: ['latin'] });
const { fontFamily: oswald }     = loadOswald('normal',     { weights: ['600'], subsets: ['latin'] });
const { fontFamily: raleway }    = loadRaleway('normal',    { weights: ['800'], subsets: ['latin'] });

export type SloganFont = 'roboto' | 'playfair' | 'montserrat' | 'oswald' | 'raleway';

const FONT_MAP: Record<SloganFont, string> = { roboto, playfair, montserrat, oswald, raleway };

function strokeShadows(color: string, size: number, blur: number): string {
  const parts: string[] = [];
  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      if (x === 0 && y === 0) continue;
      if (Math.sqrt(x * x + y * y) <= size + 0.5) {
        parts.push(`${x}px ${y}px ${blur}px ${color}`);
      }
    }
  }
  return parts.join(', ');
}

function makeStickerShadow(whiteStroke: number, blackStroke: number): string {
  return [
    strokeShadows('white', whiteStroke, 1.5),
    strokeShadows('#3A3A3A', blackStroke, 3),
  ].join(', ');
}

function titleCase(text: string): string {
  return text.replace(/(?<!')\b\w/g, c => c.toUpperCase());
}

type Segment = { text: string; color?: string };
type Line = string | Segment[];

interface TextEntry {
  from: number;
  to: number;
  lines: Line[];
  size?: number;
  sweep?: boolean;
  secondLineFrom?: number;
  fadeOutFrames?: number;
  professional?: boolean;
}

const G = C_GREEN;
const R = C_RED;
const O = C_ORANGE;

const ENTRIES: TextEntry[] = [
  { from: 8,   to:  57, lines: [[{ text: 'Part ' }, { text: 'OK', color: G }]] },
  { from: 57,  to: 106, lines: [[{ text: 'Quality ' }, { text: 'OK', color: G }]] },
  { from: 106, to: 155, lines: [[{ text: 'Line ' }, { text: 'running', color: G }]] },
  { from: 155, to: 204, lines: [[{ text: 'Output ' }, { text: 'steady', color: G }]] },
  { from: 204, to: 252, lines: [[{ text: 'No issues', color: G }, { text: ' detected' }]] },
  { from: 259, to: 330, lines: [[{ text: 'Is it ' }, { text: 'isolated', color: R }, { text: '?' }]] },
  { from: 335, to: 375, lines: [[{ text: 'Is it ' }, { text: 'spreading', color: O }, { text: '?' }]] },
  { from: 380, to: 418, lines: [[{ text: 'Can we keep ' }, { text: 'running', color: R }, { text: '?' }]] },
  { from: 428, to: 468, lines: ['Without clarity:'] },
  { from: 468, to: 553, lines: [[{ text: "Everyone's " }, { text: 'guessing', color: O }]] },
  { from: 553, to: 658, lines: [[{ text: 'Cut through the fog with AI', color: '#1A52A8' }]], sweep: true },
  {
    from: 668,
    to: 880,
    lines: ["AI doesn't stop the defect", 'It stops the guessing'],
    fadeOutFrames: 15,
    professional: true,
  },
];

export const STICKER_FRAMES = ENTRIES.slice(0, -1).map(e => e.from);

const GLITCH_X = [9, -6, 3];
const GLITCH_Y = [-2, 1, 0];

interface Props {
  frame: number;
  fontSize?: number;
  whiteStroke?: number;
  blackStroke?: number;
  sloganFont?: SloganFont;
  sloganFontSize?: number;
  sloganTitleCase?: boolean;
}

export const TextOverlay: React.FC<Props> = ({
  frame,
  fontSize = 68,
  whiteStroke = 7,
  blackStroke = 8,
  sloganFont = 'playfair',
  sloganFontSize = 72,
  sloganTitleCase = false,
}) => {
  const stickerShadow = makeStickerShadow(whiteStroke, blackStroke);

  return (
    <>
      {ENTRIES.map(({ from, to, lines, size = fontSize, sweep, secondLineFrom, fadeOutFrames, professional }, i) => {
        if (frame < from || frame >= to) return null;

        const enterAge = frame - from;
        const tx = (!professional && enterAge < GLITCH_X.length) ? GLITCH_X[enterAge] : 0;
        const ty = (!professional && enterAge < GLITCH_Y.length) ? GLITCH_Y[enterAge] : 0;
        const scale = (!fadeOutFrames && !professional && frame === to - 1) ? 1.06 : 1;

        const containerOpacity = fadeOutFrames
          ? interpolate(frame, [to - fadeOutFrames, to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 1;

        const proEnterOpacity = professional
          ? interpolate(enterAge, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 1;

        const activeFont     = professional ? FONT_MAP[sloganFont] : roboto;
        const activeFontSize = professional ? sloganFontSize : size;
        const activeFontWeight = professional ? 700 : 900;
        const activeTextShadow = professional ? '0 2px 12px rgba(0,0,0,0.18)' : stickerShadow;
        const activeLetterSpacing = professional ? '0.01em' : '-0.025em';

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 58,
              left: 60,
              right: 60,
              opacity: containerOpacity * proEnterOpacity,
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            {lines.map((line, j) => {
              const lineOpacity = (j === 1 && secondLineFrom != null)
                ? interpolate(frame, [secondLineFrom, secondLineFrom + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                : 1;

              const renderLine = (content: Line): React.ReactNode => {
                if (typeof content === 'string') {
                  return professional && sloganTitleCase ? titleCase(content) : content;
                }
                return content.map((seg, k) => (
                  <span key={k} style={seg.color ? { color: seg.color } : undefined}>
                    {seg.text}
                  </span>
                ));
              };

              return (
                <div
                  key={j}
                  style={{
                    opacity: lineOpacity,
                    fontFamily: activeFont,
                    fontWeight: activeFontWeight,
                    fontSize: activeFontSize,
                    lineHeight: 1.3,
                    color: C_TEXT,
                    letterSpacing: activeLetterSpacing,
                    textShadow: activeTextShadow,
                  }}
                >
                  {renderLine(line)}
                </div>
              );
            })}
            {sweep && (() => {
              const containerW = 960;
              const beamW = containerW * 0.15;
              const progress = interpolate(frame, [SCENE4_START, SCENE4_END], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              const beamLeft = progress * (containerW + beamW) - beamW;
              return (
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0,
                    left: beamLeft,
                    width: beamW,
                    background: 'linear-gradient(to right, rgba(100,200,255,0) 0%, rgba(140,210,255,0.45) 35%, rgba(200,240,255,0.8) 50%, rgba(140,210,255,0.45) 65%, rgba(100,200,255,0) 100%)',
                  }} />
                </div>
              );
            })()}
          </div>
        );
      })}
    </>
  );
};

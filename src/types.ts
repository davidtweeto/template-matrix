export interface CellData {
  base: 'empty' | 'gray' | 'green' | 'red' | 'orange';
  appearAge: number;      // frames since appeared (pop spring)
  pulseAge: number;       // frames since pulsing started (red/orange), -1 if inactive
  sweepProgress: number;  // 0–1 scan sweep bar, -1 if inactive
  flipAge: number;        // production flip (gray → color), -1 if inactive
  colorFlipAge: number;   // secondary flip (green → red or orange), -1 if inactive
  isQuestion: boolean;    // true only for Q_MARK orange cells — shows the ? glyph
  endFadeOpacity: number; // 1 normally; fades to 0 during end-phase
}

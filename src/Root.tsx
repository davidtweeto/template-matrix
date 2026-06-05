import React from 'react';
import { Composition } from 'remotion';
import { MatrixComposition, MatrixCompositionSchema } from './Composition';
import { FPS, TOTAL_FRAMES } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Matrix"
      component={MatrixComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1080}
      schema={MatrixCompositionSchema}
      defaultProps={{
        fontSize: 83,
        whiteStroke: 9,
        blackStroke: 11,
        sloganFont: "oswald" as const,
        sloganFontSize: 88,
        sloganTitleCase: true,
      }}
    />
  );
};

import React from 'react';
import { Composition } from 'remotion';
import { SneezeHolding } from './SneezeHolding';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SneezeHolding"
      component={SneezeHolding}
      durationInFrames={2700}
      fps={60}
      width={1080}
      height={1920}
    />
  </>
);

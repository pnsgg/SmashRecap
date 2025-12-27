import { Player, type PlayerRef } from '@remotion/player';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Main } from './Main';

export interface PlayerSchema {
  titleText: string;
  titleColor: string;
  logoColor1: string;
  logoColor2: string;
}

export const PlayerView = forwardRef((props: { data: PlayerSchema }, ref) => {
  const playerRef: React.RefObject<PlayerRef | null> = React.createRef();

  useImperativeHandle(ref, () => ({
    get playerRef() {
      return playerRef.current;
    }
  }));

  return (
    <Player
      ref={playerRef}
      component={Main}
      durationInFrames={150}
      fps={30}
      compositionHeight={1080}
      compositionWidth={1920}
      inputProps={props.data}
      style={{ width: '100%' }}
      controls
    />
  );
});

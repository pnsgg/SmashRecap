import { Player, type PlayerRef } from '@remotion/player';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { ThisIsMyRecap, type ThisIsMyRecapProps } from './ThisIsMyRecap';

export type PlayerSchema = ThisIsMyRecapProps;

export type PlayerViewProps = {
  data: PlayerSchema;
  onPaused?: () => void;
};

export const PlayerView = forwardRef((props: PlayerViewProps, ref) => {
  const playerRef: React.RefObject<PlayerRef | null> = React.createRef();

  useEffect(() => {
    if (playerRef.current) {
      // add callback when player pauses
      playerRef.current.addEventListener('pause', () => {
        props.onPaused?.();
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    get playerRef() {
      return playerRef.current;
    }
  }));

  return (
    <Player
      ref={playerRef}
      component={ThisIsMyRecap}
      durationInFrames={120}
      fps={30}
      compositionHeight={600}
      compositionWidth={600}
      inputProps={props.data}
      acknowledgeRemotionLicense
      autoPlay
      controls={true}
      showVolumeControls={false}
      allowFullscreen={false}
      doubleClickToFullscreen={false}
      style={{ width: '100%' }}
      initiallyMuted={false}
    />
  );
});

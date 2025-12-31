import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { z } from 'zod';
import { colors } from './../styles';

export const favouriteCharacterSchema = z.object({
  name: z.string(),
  count: z.number(),
  image: z.string()
});

export type FavouriteCharacterType = z.infer<typeof favouriteCharacterSchema>;

export const GROW_DURATION = 20;
export const SHRINK_DURATION = 15;
export const HOLD_DURATION = 35;
export const TOTAL_DURATION = GROW_DURATION + HOLD_DURATION + SHRINK_DURATION;

interface CharacterProps {
  character: FavouriteCharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ANGLE = -5;
  const MAX_BG_HEIGHT = 530;

  const spr = interpolate(
    frame,
    [0, GROW_DURATION, GROW_DURATION + HOLD_DURATION, TOTAL_DURATION],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.bezier(0.19, 1.0, 0.22, 1.0))
    }
  );

  const sprFilters = spring({
    fps,
    frame,
    config: {
      mass: 0.3,
      damping: 200,
      stiffness: 200
    },
    delay: 5
  });

  const bgHeight = interpolate(spr, [0, 1], [0, MAX_BG_HEIGHT]);
  const brightness = interpolate(sprFilters, [0, 1], [0, 1]);
  const grayscale = interpolate(sprFilters, [0, 1], [1, 0]);
  const scale = interpolate(spr, [0, 1], [0.75, 1]);
  const opacity = interpolate(spr, [0, 1], [0, 1], {
    easing: Easing.in(Easing.bezier(1, 0, 0, 0))
  });
  const translateXImage = interpolate(spr, [0, 1], [0, -25]);

  const paragraphStyles: React.CSSProperties = {
    fontSize: 64,
    lineHeight: 1,
    textAlign: 'center',
    letterSpacing: '-0.04em'
  };

  return (
    <AbsoluteFill id="remotion-root">
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: `linear-gradient(to bottom left, #414BC3, #5075DA)`,
            transform: `rotate(${ANGLE}deg) translateX(${translateXImage}px)`,
            height: bgHeight,
            width: width + 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            clipPath: 'inset(-50% 0 5px 0)'
          }}
        >
          <Img
            src={staticFile(character.image)}
            alt=""
            width={width}
            height={height}
            style={{
              transform: `rotate(${-ANGLE}deg) scale(${scale})`,
              filter: `grayscale(${grayscale}) brightness(${brightness})`,
              transformOrigin: 'bottom right',
              placeSelf: 'center'
            }}
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 50,
          bottom: 10,
          transform: `perspective(500px) rotateX(0deg) rotateY(30deg) rotateZ(-3deg) translateY(-50px)`,
          opacity
        }}
      >
        <p
          style={{
            ...paragraphStyles,
            color: colors.reallyWhite,
            fontSize: 80,
            fontFamily: 'Impact, sans-serif',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            textShadow: '5px 5px 0 #000'
          }}
        >
          {character.name}
        </p>
        <p
          style={{
            ...paragraphStyles,
            backgroundImage: 'linear-gradient(#FDE40D, #FFB027)',
            color: 'transparent',
            backgroundClip: 'text',
            paddingBottom: 10,
            fontFamily: 'Impact, sans-serif',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            filter: 'drop-shadow(3px 3px 0px #000)',
            paddingRight: 50
          }}
        >
          {character.count} game{character.count === 1 ? '' : 's'}
        </p>
      </div>
    </AbsoluteFill>
  );
};

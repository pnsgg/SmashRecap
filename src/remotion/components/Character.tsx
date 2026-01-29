import React from 'react';
import { z } from 'zod';
import {
  CharacterDisplay,
  GROW_DURATION,
  HOLD_DURATION,
  SHRINK_DURATION,
  SubtitleText,
  TOTAL_DURATION
} from './CharacterDisplay';

export const favouriteCharacterSchema = z.object({
  name: z.string(),
  count: z.number(),
  image: z.string()
});

export type FavouriteCharacterType = z.infer<typeof favouriteCharacterSchema>;

export { GROW_DURATION, HOLD_DURATION, SHRINK_DURATION, TOTAL_DURATION };

interface CharacterProps {
  character: FavouriteCharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  return (
    <CharacterDisplay
      name={character.name}
      image={character.image}
      renderSubtitle={() => (
        <SubtitleText style={{ paddingBottom: 10, paddingRight: 50 }}>
          {character.count} game{character.count === 1 ? '' : 's'}
        </SubtitleText>
      )}
    />
  );
};

import { cleanSweepSchema } from '../../remotion/CleanSweep';
import { dqSchema } from '../../remotion/DQ';
import { favouriteCharactersSchema } from '../../remotion/FavouriteCharacter';
import { game5WarriorSchema } from '../../remotion/Game5Warrior';
import { highestUpsetSchema } from '../../remotion/HighestUpset';
import { myPerformancesSchema } from '../../remotion/MyPerformances';
import { theGauntletSchema } from '../../remotion/TheGauntlet';
import { thisIsMyRecapSchema } from '../../remotion/ThisIsMyRecap';
import { tournamentsSchema } from '../../remotion/Tournaments';
import { worstMatchupsSchema } from '../../remotion/WorstMatchups';
import { z } from 'zod';

export const mainSchema = z.object({
    thisIsMyRecapProps: thisIsMyRecapSchema,
    tournamentsProps: tournamentsSchema,
    performancesProps: myPerformancesSchema,
    favouriteCharactersProps: favouriteCharactersSchema,
    worstMatchupsProps: worstMatchupsSchema,
    highestUpsetProps: highestUpsetSchema.optional(),
    game5WarriorProps: game5WarriorSchema,
    cleanSweepProps: cleanSweepSchema,
    dqProps: dqSchema,
    gauntletProps: theGauntletSchema
});

export type MainProps = z.infer<typeof mainSchema>;

import { colors, typography, makeFontVariationSettings } from '../../styles';

export const textStyles = {
    fontFamily: typography.fontFamily,
    color: colors.reallyWhite,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    width: '100%',
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
    fontVariationSettings: makeFontVariationSettings({ weight: 900, width: 75 }),
};

export const getTextStyle = (size: 'heading' | 'heading1' | 'heading2', primary?: boolean) => {
    // Responsive sizes using viewport width (vw)
    // Works for both 1920px (Landscape) and 1080px (Vertical)
    const baseSize = {
        heading: '10vw',   // ~190px on 1920w, ~108px on 1080w
        heading1: '7vw',   // ~134px on 1920w, ~75px on 1080w
        heading2: '5vw',   // ~96px on 1920w, ~54px on 1080w
    }[size];

    return {
        ...textStyles,
        fontSize: baseSize,
        color: primary ? colors.redPns : textStyles.color,
    };
};

export interface TextEffectProps {
    text: string;
    primary?: boolean;
    size?: 'heading' | 'heading1' | 'heading2';
}

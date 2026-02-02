import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';
import { colors } from '../../styles';

export const GlitchText: React.FC<TextEffectProps> = ({ text, primary, size = 'heading' }) => {
    const frame = useCurrentFrame();

    // Glitch intensity decreases over time
    const intensity = Math.max(0, 1 - frame / 15);

    // Random skew and offset
    const skew = random(frame) * 20 * intensity - (10 * intensity);
    const xOffset = (random(frame + 1) * 10 - 5) * intensity;
    const yOffset = (random(frame + 2) * 10 - 5) * intensity;

    // RGB Split
    const rOffset = 5 * intensity;
    const gOffset = -5 * intensity;

    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
                {/* Red Channel */}
                <div style={{
                    ...style,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${xOffset + rOffset}px, ${yOffset}px) skew(${skew}deg)`,
                    color: colors.redPns,
                    opacity: 0.8 * intensity,
                    clipPath: `inset(${random(frame) * 100}% 0 0 0)`
                }}>
                    {text}
                </div>
                {/* Cyan Channel - approximating blueBuvette or just cyan mix */}
                <div style={{
                    ...style,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${xOffset + gOffset}px, ${yOffset}px) skew(${-skew}deg)`,
                    color: colors.blueBuvette,
                    opacity: 0.8 * intensity,
                    clipPath: `inset(0 0 ${random(frame + 5) * 100}% 0)`
                }}>
                    {text}
                </div>

                {/* Main Text */}
                <div style={{
                    ...style,
                    transform: `translate(${xOffset}px, ${yOffset}px) skew(${skew}deg)`
                }}>
                    {text}
                </div>
            </div>
        </AbsoluteFill>
    );
};

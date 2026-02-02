import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';

export const MaskRevealText: React.FC<TextEffectProps> = ({ text, primary, size = 'heading' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 }
    });

    const translateY = interpolate(entrance, [0, 1], [100, 0]);

    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ overflow: 'hidden', paddingBottom: 20 }}> {/* Padding for descenders */}
                <div style={{
                    ...style,
                    transform: `translateY(${translateY}%)`
                }}>
                    {text}
                </div>
            </div>
        </AbsoluteFill>
    );
};

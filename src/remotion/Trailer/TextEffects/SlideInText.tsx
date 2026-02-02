import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';

export const SlideInText: React.FC<TextEffectProps> = ({ text, primary, size = 'heading' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 }
    });

    const translateY = interpolate(entrance, [0, 1], [100, 0]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);

    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                ...style,
                opacity,
                transform: `translateY(${translateY}px)`
            }}>
                {text}
            </div>
        </AbsoluteFill>
    );
};

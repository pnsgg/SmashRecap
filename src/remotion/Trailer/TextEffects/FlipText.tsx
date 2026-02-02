import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';

export const FlipText: React.FC<TextEffectProps> = ({ text, primary, size = 'heading' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 100 }
    });

    const rotateX = interpolate(entrance, [0, 1], [90, 0]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);

    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1000 }}>
            <div style={{
                ...style,
                opacity,
                transform: `rotateX(${rotateX}deg)`
            }}>
                {text}
            </div>
        </AbsoluteFill>
    );
};

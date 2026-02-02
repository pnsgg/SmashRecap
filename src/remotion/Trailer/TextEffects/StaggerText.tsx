import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';

export const StaggerText: React.FC<TextEffectProps> = ({ text, primary, size = 'heading' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const chars = text.split('');
    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <div style={{ ...style, display: 'flex', justifyContent: 'center' }}>
                {chars.map((char, i) => {
                    const delay = i * 2;
                    const entrance = spring({
                        frame: frame - delay,
                        fps,
                        config: { damping: 15, stiffness: 200 }
                    });

                    const opacity = interpolate(entrance, [0, 1], [0, 1]);
                    const translateY = interpolate(entrance, [0, 1], [50, 0]);
                    const scale = interpolate(entrance, [0, 1], [0.5, 1]);

                    return (
                        <span key={i} style={{
                            opacity,
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            display: 'inline-block',
                            whiteSpace: 'pre'
                        }}>
                            {char}
                        </span>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

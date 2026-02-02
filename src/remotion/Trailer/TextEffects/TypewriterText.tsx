import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { getTextStyle, TextEffectProps } from './utils';

export const TypewriterText: React.FC<TextEffectProps & { delay?: number }> = ({ text, primary, size = 'heading', delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const startFrame = Math.max(0, frame - delay);

    // Type speed: 1 character every 2 frames
    const charsShown = Math.floor(startFrame / 2);
    const textToShow = text.slice(0, charsShown);
    const cursorVisible = Math.floor(frame / 10) % 2 === 0;

    const style = getTextStyle(size, primary);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={style}>
                {textToShow}
                <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
            </div>
        </AbsoluteFill>
    );
};

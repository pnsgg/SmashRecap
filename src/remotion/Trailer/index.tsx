import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stocks } from '../components/Stocks';
import { Maskass } from '../components/Maskass';
import { colors } from '../styles';
import { StaggerText } from './TextEffects/StaggerText';
import { TypewriterText } from './TextEffects/TypewriterText';
import { SlideInText } from './TextEffects/SlideInText';
import { FlipText } from './TextEffects/FlipText';
import { MaskRevealText } from './TextEffects/MaskRevealText';

const AnimatedBackground = () => {
    // Static background as requested
    return (
        <AbsoluteFill style={{
            backgroundColor: colors.nearlyBlack,
            transform: 'scale(1.2)' // Keep scale to ensure coverage
        }}>
            <Stocks opacity={0.10} />
        </AbsoluteFill>
    )
}

const MaskassEffect = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const maskassSpring = spring({
        fps,
        frame,
        durationInFrames: 150,
        config: { damping: 200 }
    });

    const maskassScreenX = interpolate(maskassSpring, [0, 1], [-width, width]);
    const maskassScreenY = interpolate(maskassSpring, [0, 1], [height, -height]);

    return (
        <AbsoluteFill
            style={{
                zIndex: 10,
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translate(${maskassScreenX - 60}px, ${maskassScreenY - 25}px) rotate(-10deg) scale(2)`,
            }}
        >
            <Maskass fps={24} />
        </AbsoluteFill>
    );
}

const CTAScene = () => {
    const frame = useCurrentFrame();
    const showFirstText = frame < 32;

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <MaskassEffect />
            {showFirstText ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                    <div style={{ height: 100, width: 1500, position: 'relative' }}>
                        <MaskRevealText text="GÉNÉREZ VOTRE VIDÉO" size="heading2" />
                    </div>
                    <div style={{ height: 150, width: 1500, position: 'relative' }}>
                        <MaskRevealText text="MAINTENANT" size="heading1" primary />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                    <div style={{ height: 150, width: 1500, position: 'relative' }}>
                        <TypewriterText text="RECAP.PNS.GG" size="heading" primary delay={32} />
                    </div>
                </div>
            )}
        </AbsoluteFill>
    );
}

export const Trailer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: colors.nearlyBlack }}>
            <AnimatedBackground />

            {/* Intro - Sequential */}
            <Sequence from={0} durationInFrames={25}>
                <StaggerText text="PRÊT ?" />
            </Sequence>
            <Sequence from={25} durationInFrames={25}>
                <StaggerText text="REVIVEZ" />
            </Sequence>
            <Sequence from={50} durationInFrames={35}>
                <StaggerText text="VOTRE ANNÉE" primary />
            </Sequence>

            {/* Context - Sequential */}
            <Sequence from={85} durationInFrames={25}>
                <TypewriterText text="365 JOURS" size="heading1" />
            </Sequence>
            <Sequence from={110} durationInFrames={25}>
                <TypewriterText text="DE SMASH" size="heading1" primary />
            </Sequence>

            {/* Features - Sequential */}
            <Sequence from={135} durationInFrames={25}>
                <SlideInText text="VOS RIVAUX" />
            </Sequence>
            <Sequence from={160} durationInFrames={25}>
                <SlideInText text="VOS PERSOS" />
            </Sequence>
            <Sequence from={185} durationInFrames={25}>
                <SlideInText text="ET BIEN PLUS ENCORE" />
            </Sequence>

            {/* Climax - Sequential */}
            <Sequence from={210} durationInFrames={35}>
                <StaggerText text="TOUT EST LÀ" />
            </Sequence>

            <Sequence from={245} durationInFrames={45}>
                <StaggerText text="SMASH RECAP" primary size="heading" />
            </Sequence>

            {/* CTA - Mask Reveal */}
            <Sequence from={290} durationInFrames={160}>
                <CTAScene />
            </Sequence>
        </AbsoluteFill>
    );
};

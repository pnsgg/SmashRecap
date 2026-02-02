import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import type { MainProps } from '../lib/schemas/stats';
import { PNSLogo } from './components/PNSLogo';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';
import { ALL_FIGHTERS } from './constants';

const Section: React.FC<{
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div
    style={{
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      ...style
    }}
  >
    {title && (
      <div
        style={{
          ...typography.smallText,
          fontSize: 20,
          color: colors.silver,
          textTransform: 'uppercase',
          marginBottom:
            title === 'Most Played' ||
            title === 'Best Results' ||
            title === 'Personal Demons' ||
            title === 'Rivalries'
              ? 8
              : 0
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

const CharacterColumn: React.FC<{
  name: string;
  image: string;
  stats: string;
  borderColor?: string;
  isExternal?: boolean;
}> = ({ name, image, stats, borderColor = colors.silver, isExternal = false }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      flex: 1,
      textAlign: 'center'
    }}
  >
    <div
      style={{
        width: 120,
        height: 120,
        backgroundColor: colors.nearlyBlack,
        overflow: 'hidden',
        border: `4px solid ${borderColor}`
      }}
    >
      <Img
        src={isExternal ? image : staticFile(image)}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
    <div style={{ width: '100%' }}>
      <div
        style={{
          ...typography.heading4,
          fontSize: 24,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 150,
          textAlign: 'center',
          margin: '0 auto'
        }}
      >
        {name}
      </div>
      <div style={{ color: colors.silver, fontSize: 18 }}>{stats}</div>
    </div>
  </div>
);

const NotableRunRow: React.FC<{
  title: string;
  subtitle: string;
  stats: string;
  image?: string;
  color: string;
}> = ({ title, subtitle, stats, image, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div
      style={{
        width: 76,
        height: 76,
        backgroundColor: color,
        overflow: 'hidden'
      }}
    >
      {image ? (
        <Img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 900,
            color: colors.nearlyBlack,
            fontFamily: 'Impact'
          }}
        >
          {title.charAt(0)}
        </div>
      )}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ ...typography.heading4, fontSize: 24, color }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{subtitle}</div>
      <div style={{ fontSize: 20, color: colors.silver, fontWeight: 700 }}>{stats}</div>
    </div>
  </div>
);

const TournamentRow: React.FC<{
  placement: number;
  name: string;
  image?: string;
  attendees: number;
}> = ({ placement, name, image, attendees }) => {
  const color =
    placement === 1
      ? colors.gold
      : placement === 2
        ? colors.silver
        : placement === 3
          ? colors.bronze
          : colors.reallyWhite;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 36, fontWeight: 800, color, width: 80 }}>#{placement}</div>
      {image && (
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <Img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            ...typography.heading4,
            fontSize: 20,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 300
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 14, color: colors.silver }}>{attendees} Entrants</div>
      </div>
    </div>
  );
};

const RivalryRow: React.FC<{
  label: string;
  tag: string;
  wins: number;
  losses: number;
  image?: string;
  color: string;
}> = ({ label, tag, wins, losses, image, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ color, fontWeight: 700, width: 72 }}>{label}</div>
    {image && (
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `4px solid ${color}`
        }}
      >
        <Img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )}
    <div>
      <div style={{ ...typography.heading4, fontSize: 24 }}>{tag}</div>
      <div style={{ fontSize: 20, color: colors.silver, fontWeight: 700 }}>
        {wins}W - {losses}L
      </div>
    </div>
  </div>
);

const QuickStatBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div
    style={{
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: '20px 12px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}
  >
    <div
      style={{
        fontSize: 16,
        color: colors.silver,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, color: colors.reallyWhite }}>{value}</div>
  </div>
);

export const VerticalStill: React.FC<MainProps> = ({
  thisIsMyRecapProps: { user, year },
  tournamentsProps: { attendance },
  performancesProps: { performances },
  favouriteCharactersProps: { characters },
  rivalryProps,
  gauntletProps,
  game5WarriorProps,
  cleanSweepProps,
  dayOfWeekActivityProps,
  highestUpsetProps,
  worstMatchupsProps,
  busterRunProps,
  dqProps,
  gameStats,
  setsPlayed
}) => {
  const totalTournaments = attendance.reduce(
    (acc: number, curr: { attendance: number }) => acc + curr.attendance,
    0
  );
  const winRate = gameStats.winRate;
  const fightersFaced = gauntletProps?.encountered.length ?? 0;
  const cleanSweeps = cleanSweepProps.totalSweeps;
  const dqs = dqProps.totalDQs;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        color: colors.reallyWhite,
        fontFamily: typography.fontFamily,
        padding: '32px 32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <Stocks opacity={0.04} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, zIndex: 1 }}>
        {user.image && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `4px solid ${colors.redPns}`
            }}
          >
            <Img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div>
          {user.prefix && (
            <div
              style={{ ...typography.heading, fontSize: 32, color: colors.silver, marginBottom: 4 }}
            >
              {user.prefix}
            </div>
          )}
          <h1 style={{ ...typography.heading, fontSize: 80, margin: 0, lineHeight: 1 }}>
            {user.gamerTag}
          </h1>
          <div
            style={{
              ...typography.subtitle,
              color: colors.redPns,
              fontSize: 36,
              fontVariationSettings: makeFontVariationSettings({ weight: 700 })
            }}
          >
            {year} SMASH RECAP
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <PNSLogo
            style={{ transform: 'scale(2)', transformOrigin: 'right center' }}
            color={colors.reallyWhite}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          zIndex: 1
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Section title="Tournament Activity">
            <div
              style={{ fontSize: 100, fontWeight: 800, lineHeight: 0.8, color: colors.reallyWhite }}
            >
              {totalTournaments}
            </div>
            <div style={{ ...typography.heading3 }}>Tournaments Attended</div>
          </Section>

          <Section title="Most Played">
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
              {characters.slice(0, 3).map((char) => (
                <CharacterColumn
                  key={char.name}
                  name={char.name}
                  image={char.image}
                  stats={`${char.count} Games`}
                  borderColor={colors.gold}
                />
              ))}
            </div>
          </Section>

          {(highestUpsetProps || busterRunProps) && (
            <Section title="Notable Runs" style={{ gap: 24 }}>
              {highestUpsetProps && (
                <NotableRunRow
                  title="Best Upset"
                  subtitle={`Won vs ${highestUpsetProps.opponent.gamerTag}`}
                  stats={`SPR: +${highestUpsetProps.match.factor}`}
                  image={highestUpsetProps.tournament.image}
                  color={colors.reallyWhite}
                />
              )}
              {busterRunProps && (
                <NotableRunRow
                  title="Buster Run"
                  subtitle={`${busterRunProps.finalPlacement}th at ${busterRunProps.tournament.name}`}
                  stats={`SPR: ${busterRunProps.spr}`}
                  image={busterRunProps.tournament.image}
                  color={colors.reallyWhite}
                />
              )}
            </Section>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Section title="Best Results">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {performances.slice(0, 3).map((perf, i) => (
                <TournamentRow
                  key={i}
                  placement={perf.finalPlacement}
                  name={perf.tournament.name}
                  image={perf.tournament.image}
                  attendees={perf.tournament.attendees}
                />
              ))}
            </div>
          </Section>

          {worstMatchupsProps && (
            <Section title="Personal Demons">
              <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                {worstMatchupsProps.matchups.slice(0, 3).map((match) => (
                  <CharacterColumn
                    key={match.characterName}
                    name={match.characterName}
                    image={match.image}
                    stats={`${match.lossCount} losses (${match.looseRate.toFixed(1)}%)`}
                    borderColor={colors.redPns}
                  />
                ))}
              </div>
            </Section>
          )}

          {rivalryProps && (
            <Section title="Rivalries">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {rivalryProps.rival && (
                  <RivalryRow
                    label="RIVAL"
                    tag={rivalryProps.rival.gamerTag}
                    wins={rivalryProps.rival.wins}
                    losses={rivalryProps.rival.losses}
                    image={rivalryProps.rival.image}
                    color={colors.gold}
                  />
                )}
                {rivalryProps.nemesis && (
                  <RivalryRow
                    label="NEMESIS"
                    tag={rivalryProps.nemesis.gamerTag}
                    wins={rivalryProps.nemesis.wins}
                    losses={rivalryProps.nemesis.losses}
                    image={rivalryProps.nemesis.image}
                    color={colors.redPns}
                  />
                )}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Quick Stats Snapshot */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          zIndex: 1,
          paddingTop: 8
        }}
      >
        <QuickStatBox label="Sets Played" value={setsPlayed} />
        <QuickStatBox label="Win Rate" value={`${winRate.toFixed(1)}%`} />
        <QuickStatBox label="Game 5 Sets" value={game5WarriorProps.totalSets} />
        <QuickStatBox label="Fighters Faced" value={`${fightersFaced}/${ALL_FIGHTERS.length}`} />
        <QuickStatBox label="Clean Sweeps" value={cleanSweeps} />
        <QuickStatBox label="DQs" value={dqs} />
      </div>

      <div
        style={{
          textAlign: 'center',
          color: colors.reallyWhite,
          fontSize: 24,
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          marginTop: 'auto'
        }}
      >
        Get your SmashRecap at recap.pns.gg
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import { colors } from '../styles';

export type PlayerCardProps = {
  image: string;
  prefix?: string;
  gamerTag: string;
  country?: string;
  pronouns?: string;
  xHandle?: string;
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      padding: '0.5rem 0.75rem',
      backgroundColor: colors.redPns,
      color: colors.reallyWhite,
      fontVariationSettings: '"wght" 700, "wdth" 75',
      fontSize: 16,
      lineHeight: 1,
      textTransform: 'uppercase'
    }}
  >
    {children}
  </div>
);

export const PlayerCard: React.FC<PlayerCardProps> = ({
  image,
  prefix,
  gamerTag,
  country,
  pronouns,
  xHandle
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width: 'fit-content',
        paddingLeft: 36
      }}
    >
      {/* Image */}
      <div
        style={{
          transform: 'rotate(-15deg)',
          width: 160,
          height: 160,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformOrigin: 'center center',

          marginTop: -22,
          marginRight: -12
        }}
      >
        <img
          src={image}
          style={{
            transform: 'rotate(15deg)',
            width: 220,
            height: 220
          }}
        />
      </div>

      {/* Information */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {/* Prefix GamerTag */}
        <div
          style={{
            width: 398
          }}
        >
          {/* Border Like */}
          <div style={{ height: 6, backgroundColor: colors.redPns }}></div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingLeft: 38,
              paddingTop: 20,
              paddingBottom: 20,
              paddingRight: 12,
              backgroundColor: colors.nearlyBlack,
              color: colors.reallyWhite
            }}
          >
            {prefix && (
              <p
                style={{
                  fontSize: 26,
                  fontVariationSettings: '"wght" 700, "wdth" 80',
                  color: colors.redPns
                }}
              >
                {prefix}
              </p>
            )}
            <p
              style={{
                fontSize: 44,
                fontVariationSettings: '"wght" 700, "wdth" 80',
                color: colors.reallyWhite
              }}
            >
              {gamerTag}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 28px'
          }}
        >
          {country && <Badge>{country}</Badge>}
          {pronouns && <Badge>{pronouns}</Badge>}
          {xHandle && <Badge>@{xHandle}</Badge>}
        </div>
      </div>
    </div>
  );
};

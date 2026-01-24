import React from 'react';

export const PNSLogo: React.FC<{
  style?: React.CSSProperties;
  color?: string;
}> = ({ style, color = 'white' }) => {
  return (
    <svg
      width="48"
      height="17"
      viewBox="0 0 48 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M41.7049 12.75H33.3115V17H45.0325L48 13.9948V6.375H37.5082V4.25H48V0H36.279L33.3115 3.00521V10.625H41.7049V12.75Z"
        fill={color}
      />
      <path
        d="M24.918 17H31.2131V0H27.0164L27.0164 10.625L22.8197 0H16.5246V17H20.7213L20.7213 6.375L24.918 17Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.541 0L14.6885 3.1875V7.4375L11.541 10.625L4.19672 10.625V17H0V0H11.541ZM10.4918 4.25V6.375H4.19672V4.25H10.4918Z"
        fill={color}
      />
    </svg>
  );
};

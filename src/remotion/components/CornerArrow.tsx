import React from 'react';

export interface CornerArrowProps extends React.SVGProps<SVGSVGElement> {
  fill: string;
  direction: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const CornerArrow: React.FC<CornerArrowProps> = ({ fill, direction, ...props }) => {
  let transform = '';
  switch (direction) {
    case 'top-left':
      transform = 'rotate(-90deg)';
      break;
    case 'top-right':
      transform = 'rotate(0deg)';
      break;
    case 'bottom-left':
      transform = 'rotate(-180deg)';
      break;
    case 'bottom-right':
      transform = 'rotate(90deg)';
      break;
  }

  return (
    <svg
      style={{
        transform
      }}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.00258 4.70711L3.69929 9.0104L2.99219 8.3033L7.29548 4H3.5026V3H9.00258V8.5H8.00258V4.70711Z"
        fill={fill}
      />
    </svg>
  );
};

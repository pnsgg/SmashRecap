export const colors = {
  reallyWhite: 'white',
  redPns10: '#fff5f7',
  redPns25: '#fad6de',
  redPns: '#ff1b4c',
  redPns75: '#c20a32',
  redPns90: '#7d001b',
  nearlyBlack: '#1b0015',
  blueBuvette: '#1cc1ff',
  violetPop: '#cb1cff',
  gold: '#ffe078',
  silver: '#d0d0d0',
  bronze: '#cd7f32',
  success: '#00d51d',
  error: '#f50000'
};

export const makeFontVariationSettings = ({
  width,
  weight
}: {
  width?: number;
  weight?: number;
}) => {
  if (!width && !weight) {
    return undefined;
  }
  if (!width) {
    return `'wght' ${weight}`;
  }
  if (!weight) {
    return `'wdth' ${width}`;
  }
  return `'wdth' ${width}, 'wght' ${weight}`;
};

export const typography = {
  fontFamily: 'Instrument Sans',

  heading: {
    fontSize: '4rem',
    fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 }),
    lineHeight: 1
  },
  heading1: {
    fontSize: '2.75rem',
    fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 600 }),
    lineHeight: 1.1
  },
  heading2: {
    fontSize: '2rem',
    fontVariationSettings: makeFontVariationSettings({ width: 80, weight: 600 }),
    lineHeight: 1.1
  },
  heading3: {
    fontSize: '1.75rem',
    fontVariationSettings: makeFontVariationSettings({ width: 85, weight: 500 }),
    lineHeight: 1.1
  },
  heading4: {
    fontSize: '1.5rem',
    lineHeight: 1.25
  },
  smallText: {
    fontSize: '15px',
    lineHeight: 1.6,
    fontWeight: 600
  },
  subtitle: {
    fontSize: '1.25rem',
    fontVariationSettings: makeFontVariationSettings({ width: 85, weight: 600 }),
    lineHeight: 1.6
  },
  paragraph: {
    fontSize: '1.125rem',
    lineHeight: 1.4
  }
};

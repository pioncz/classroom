export const theme = {
  fonts: {
    body: '"Poppins", sans-serif',
  },
  text: {
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
    },
    heading: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
  },
  colors: {
    primary: '#1d3557',
    secondary: '#457b9d',
    highlight: '#f1faee',
    accent: '#a8dadc',
  },
  buttons: {
    primary: {
      color: 'highlight',
      bg: 'primary',
      '&:disabled': {
        opacity: 0.4,
      },
      '&:hover:not(:disabled)': {
        bg: 'accent',
      },
    },
  },
};

import { createTheme, alpha } from '@mui/material/styles';

const NEON_GREEN = '#00ff88';
const GOLD = '#ffd700';
const DARK_BG = '#0a0a0a';
const CARD_BG = '#141414';
const SURFACE = '#1a1a1a';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: NEON_GREEN,
      light: '#33ff9f',
      dark: '#00cc6a',
      contrastText: '#000000',
    },
    secondary: {
      main: GOLD,
      light: '#ffe033',
      dark: '#ccac00',
      contrastText: '#000000',
    },
    background: {
      default: DARK_BG,
      paper: CARD_BG,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    error: {
      main: '#ff4d6a',
    },
    success: {
      main: NEON_GREEN,
    },
    divider: alpha('#ffffff', 0.08),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.04em',
    },
    h2: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
    },
    h5: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
    },
    h6: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Oswald", "Impact", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
      color: TEXT_SECONDARY,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(NEON_GREEN, 0.3)} ${DARK_BG}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: DARK_BG,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(NEON_GREEN, 0.3),
            borderRadius: '4px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 28px',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(NEON_GREEN, 0.25)}`,
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${NEON_GREEN} 0%, #00cc6a 100%)`,
          color: '#000',
          '&:hover': {
            background: `linear-gradient(135deg, #33ff9f 0%, ${NEON_GREEN} 100%)`,
          },
        },
        outlined: {
          borderColor: alpha(NEON_GREEN, 0.5),
          color: NEON_GREEN,
          '&:hover': {
            borderColor: NEON_GREEN,
            background: alpha(NEON_GREEN, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: CARD_BG,
          border: `1px solid ${alpha('#ffffff', 0.06)}`,
          borderRadius: '12px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: alpha(NEON_GREEN, 0.3),
            boxShadow: `0 20px 40px ${alpha('#000', 0.4)}, 0 0 30px ${alpha(NEON_GREEN, 0.1)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 600,
          fontFamily: '"Oswald", sans-serif',
          letterSpacing: '0.05em',
        },
        filled: {
          background: alpha(NEON_GREEN, 0.15),
          color: NEON_GREEN,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(NEON_GREEN, 0.5),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: NEON_GREEN,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha(DARK_BG, 0.85),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.06)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: SURFACE,
          borderLeft: `1px solid ${alpha('#ffffff', 0.06)}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#ffffff', 0.06),
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: GOLD,
        },
        iconEmpty: {
          color: alpha('#ffffff', 0.2),
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: `linear-gradient(135deg, ${NEON_GREEN} 0%, #00cc6a 100%)`,
          color: '#000',
          fontWeight: 700,
          fontFamily: '"Oswald", sans-serif',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.06),
        },
      },
    },
  },
});

export default theme;

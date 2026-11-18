import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a5f',
    },
    secondary: {
      main: '#e07a5f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f6faff',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#5f6b7a',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600 },
    button: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 44,
          paddingInline: 20,
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
})

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
      main: '#454545',
    },
    secondary: {
      main: '#4b4b4b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#525252',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#252525',
      secondary: '#696969',
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
    borderRadius: 5,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 5,
          minHeight: 48,
          paddingInline: 24,
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
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#4b4b4b',
        },
        iconEmpty: {
          color: '#cfcfcf',
        },
      },
    },
  },
})

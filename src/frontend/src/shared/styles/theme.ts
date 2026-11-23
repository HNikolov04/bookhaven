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
      main: '#202020',
    },
    secondary: {
      main: '#202020',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
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
          transition: 'transform 150ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.MuiButton-contained': {
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-contained:hover': {
            backgroundColor: '#202020',
          },
          '&.MuiButton-outlined': {
            borderColor: '#202020',
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-outlined:hover': {
            borderColor: '#202020',
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-text': {
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-text:hover': {
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-contained.Mui-disabled': {
            backgroundColor: '#e5e5e5',
            color: '#8a8a8a',
          },
          '&.MuiButton-outlined.Mui-disabled': {
            borderColor: '#d4d4d4',
            backgroundColor: '#e5e5e5',
            color: '#8a8a8a',
          },
          '&.Mui-disabled': {
            transform: 'none',
          },
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
          color: '#f59e0b',
        },
        iconEmpty: {
          color: '#cfcfcf',
        },
      },
    },
  },
})

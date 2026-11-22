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
          '&.MuiButton-contained': {
            backgroundColor: '#202020',
            color: '#ffffff',
          },
          '&.MuiButton-contained:hover': {
            backgroundColor: '#000000',
          },
          '&.MuiButton-outlined': {
            borderColor: '#202020',
            color: '#202020',
          },
          '&.MuiButton-outlined:hover': {
            borderColor: '#000000',
            backgroundColor: '#f3f3f3',
          },
          '&.MuiButton-text': {
            color: '#202020',
          },
          '&.MuiButton-text:hover': {
            backgroundColor: '#f3f3f3',
          },
          '&.MuiButton-contained.Mui-disabled': {
            backgroundColor: '#e5e5e5',
            color: '#8a8a8a',
          },
          '&.MuiButton-outlined.Mui-disabled': {
            borderColor: '#d4d4d4',
            color: '#8a8a8a',
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

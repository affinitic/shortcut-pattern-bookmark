import React from 'react';
import {Extension} from '@root/components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import "./App.scss";


function App(props) {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          secondary: {
            dark: "#FFFFFF",
            light: "#1f39a1",
            main: "#1f39a1"
          }
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Extension {...props}/>
    </ThemeProvider>

  )
}

export default App;

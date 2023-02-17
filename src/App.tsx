import React, {useEffect, useState} from 'react';
import './App.scss';
import CommentsComponent from "./component/CommentsComponent";
import {AppBar, createTheme, CssBaseline, IconButton, ThemeProvider} from "@mui/material";
import {DarkMode, WbSunny} from "@mui/icons-material";
import {blueGrey, grey, indigo} from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blueGrey,
    secondary: grey
  }
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: indigo,
    secondary: {
      main: '#ff4081',
    }
  }
});

function App() {
  const [chosenTheme, setChosenTheme] = useState(lightTheme);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setChosenTheme(darkTheme);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setChosenTheme(event.matches ? darkTheme : lightTheme);
    });
  }, []);

  const readModeSwitchLabel = () => {
    if (chosenTheme.palette.mode === 'light') {
      return 'Auf Nachtmodus wechseln';
    } else {
      return 'Auf Tagmodus wechseln';
    }
  }

  const switchTheme = () => {
    if (chosenTheme.palette.mode === 'light') {
      setChosenTheme(darkTheme);
    } else {
      setChosenTheme(lightTheme);
    }
  }

  return (
    <ThemeProvider theme={chosenTheme}>
      <CssBaseline/>
      <AppBar position="relative" color="primary">
        <div className="body-container">
          <h1>React Comment Demo App</h1>
          <nav>
            <IconButton aria-label={readModeSwitchLabel()} onClick={switchTheme} color="inherit">
              { chosenTheme.palette.mode === 'dark' ? (<DarkMode/>) : (<WbSunny/>) }
            </IconButton>
          </nav>
        </div>
      </AppBar>
      <main className="body-container">
        <CommentsComponent/>
      </main>
    </ThemeProvider>
  );
}

export default App;

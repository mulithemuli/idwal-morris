import React, {useEffect, useState} from 'react';
import './App.scss';
import CommentsComponent from "./component/CommentsComponent";
import {createTheme, CssBaseline, IconButton, ThemeProvider} from "@mui/material";
import {WbSunny} from "@mui/icons-material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
});

function App() {
  const [chosenTheme, setChosenTheme] = useState(lightTheme);
  if (chosenTheme.palette.mode === 'light') {

  }
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setChosenTheme(darkTheme);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setChosenTheme(event.matches ? darkTheme : lightTheme);
    });
  });

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
      <header className="App-header">
        <div className="body-container">
          <h1>React Comment Demo App</h1>
          <nav>
            <IconButton aria-label={readModeSwitchLabel()} onClick={switchTheme}>
              <WbSunny/>
            </IconButton>
          </nav>
        </div>
      </header>
      <main className="body-container">
        <CommentsComponent/>
      </main>
    </ThemeProvider>
  );
}

export default App;

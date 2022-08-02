import { useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";

import "./App.css";

import Header from "./header";
import Catalog from "../../features/catalog/catalog";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#eaeaea'
      }
    }
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
};

export default App;

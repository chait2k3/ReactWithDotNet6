import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";

import "./App.css";

import Header from "./header";
import Catalog from "../../features/catalog/catalog";
import HomePage from "../../features/home/home-page";
import AboutPage from "../../features/about/about-page";
import ContactPage from "../../features/contact/contact-page";
import ProductDetails from "../../features/catalog/product-details";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#121212" : "#eaeaea",
      },
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;

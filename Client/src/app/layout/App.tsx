import { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";
import { ToastContainer } from "react-toastify";

import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

import Header from "./header";
import Catalog from "../../features/catalog/catalog";
import HomePage from "../../features/home/home-page";
import AboutPage from "../../features/about/about-page";
import ContactPage from "../../features/contact/contact-page";
import ProductDetails from "../../features/catalog/product-details";
import ServerError from '../errors/server-error';
import NotFoundError from '../errors/not-found-error';
import BasketPage from "../../features/basket/basket-page";
import { getCookie } from '../utils/utils';
import agent from '../api/agent';
import LoadingComponent from './loading-component';
import CheckoutPage from '../../features/checkout/checkout-page';
import { useAppDispatch } from '../store/configure-store';
import { setBasket } from '../../features/basket/basket-slice';

const App = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if(buyerId) {
      agent.Basket.get()
        .then(data => dispatch(setBasket(data)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  },[dispatch]);

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

  if(loading) return <LoadingComponent message='Initializing app...' />;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      <Container >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;

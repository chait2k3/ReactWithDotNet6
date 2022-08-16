import { Fragment } from "react";
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from 'react-router-dom';

import BasketSummary from "./basket-summary";
import { useAppSelector } from '../../app/store/configure-store';
import BasketTable from "./basket-table";

const BasketPage = () => {
  const { basket } = useAppSelector(state => state.basket);
  
  if (!basket)
    return <Typography variant="h3">Your basket is empty.</Typography>;

  return (
    <Fragment>
      <BasketTable items={basket.items}/>
      <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6} >
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>          
      </Grid>
    </Fragment>
  );
};

export default BasketPage;

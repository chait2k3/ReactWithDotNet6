import { Fragment } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Link } from 'react-router-dom';

import BasketSummary from "./basket-summary";
import { currencyFormat } from '../../app/utils/utils';
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import { addBasketItemAsync, removeBasketItemAsync } from './basket-slice';

const BasketPage = () => {
  const { basket, status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  
  const handleAddItem = (productId: number) => {
    dispatch(addBasketItemAsync({productId}));
  };

  const handleRemoveItem = (productId: number, quantity: number, name: string) => {
    dispatch(removeBasketItemAsync({productId, quantity, name}));
  };

  if (!basket)
    return <Typography variant="h3">Your basket is empty.</Typography>;

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    color="error"
                    loading={status === ("pendingRemoveItem" + item.productId + "rem")}
                    onClick={() => handleRemoveItem(item.productId, 1,"rem")}
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    color="secondary"
                    loading={status === ("pendingAddItem" + item.productId)}
                    onClick={() => handleAddItem(item.productId)}
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price * item.quantity)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    loading={status === ("pendingRemoveItem" + item.productId + "del")}
                    onClick={() => handleRemoveItem(item.productId, item.quantity, "del")}
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

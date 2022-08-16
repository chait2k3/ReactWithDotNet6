import { FC } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import { addBasketItemAsync, removeBasketItemAsync } from './basket-slice';

import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { currencyFormat } from "../../app/utils/utils";
import { BasketItem } from '../../app/models/basket';

interface BasketTableProps {
  items: BasketItem[];
  isBasket?:boolean;
}

const BasketTable:FC<BasketTableProps> = ({ items, isBasket = true }) => {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const handleAddItem = (productId: number) => {
    dispatch(addBasketItemAsync({ productId }));
  };

  const handleRemoveItem = (
    productId: number,
    quantity: number,
    name: string
  ) => {
    dispatch(removeBasketItemAsync({ productId, quantity, name }));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            {isBasket && (<TableCell align="right"></TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
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
              <TableCell align="right">{currencyFormat(item.price)}</TableCell>
              <TableCell align="center">
              {isBasket && (<LoadingButton
                  color="error"
                  loading={
                    status === "pendingRemoveItem" + item.productId + "rem"
                  }
                  onClick={() => handleRemoveItem(item.productId, 1, "rem")}
                >
                  <Remove />
                </LoadingButton>)}
                {item.quantity}
                {isBasket && (<LoadingButton
                  color="secondary"
                  loading={status === "pendingAddItem" + item.productId}
                  onClick={() => handleAddItem(item.productId)}
                >
                  <Add />
                </LoadingButton>)}
              </TableCell>
              <TableCell align="right">
                {currencyFormat(item.price * item.quantity)}
              </TableCell>
              {isBasket && (
                <TableCell align="right">
                <LoadingButton
                  color="error"
                  loading={
                    status === "pendingRemoveItem" + item.productId + "del"
                  }
                  onClick={() =>
                    handleRemoveItem(item.productId, item.quantity, "del")
                  }
                >
                  <Delete />
                </LoadingButton>
              </TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasketTable;

import { FC, Fragment } from "react";
import { currencyFormat } from '../../app/utils/utils';
import { useAppSelector } from '../../app/store/configure-store';
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

interface BasketSummaryProps {
  subtotal?: number;
}

const BasketSummary:FC<BasketSummaryProps> = ({ subtotal }) => {
  const { basket } = useAppSelector(state => state.basket);
  if (subtotal === undefined) {
    subtotal = basket?.items.reduce((acc, currItem) => {
      return acc + (currItem.price * currItem.quantity);
    }, 0) ?? 0;
  }
    
  const deliveryFee = subtotal > 10000 ? 0 : 500;


  return (
    <Fragment>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default BasketSummary;

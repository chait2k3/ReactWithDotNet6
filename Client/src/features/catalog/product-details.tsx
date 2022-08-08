import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import NotFoundError from "../../app/errors/not-found-error";
import LoadingComponent from "../../app/layout/loading-component";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import { addBasketItemAsync, removeBasketItemAsync } from '../basket/basket-slice';
import { productSelectors, fetchProductAsync } from './catalog-slice';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(state => productSelectors.selectById(state, id!));
  const {status: produstState} = useAppSelector(state => state.catalog);

  const { basket, status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(0);
  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if(!product) dispatch(fetchProductAsync(parseInt(id!)));
  }, [product, dispatch, id]);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const handleInputChange = (event: any) => {
    if(parseInt(event.target.value) >= 0) setQuantity(parseInt(event.target.value));
  };

  const handleUpdateCart = () => {
    // add quantity
    if(!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({
        productId: product?.id!, 
        quantity: updatedQuantity
      }));
    } else {
      // remove item
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({ 
        productId: product?.id!, 
        quantity: updatedQuantity
      }));
    }   
  };

  if (produstState.includes("pending")) return <LoadingComponent message="Loading product..." />;

  if (!product) return <NotFoundError />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name:</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type:</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand:</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity:</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              loading={status.includes("pending")}
              onClick={handleUpdateCart}
              disabled={item?.quantity === quantity || (!item && quantity === 0)}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              sx={{ height: "55px" }}
            >
              {item ? "Update Quantity" : "Add to cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;

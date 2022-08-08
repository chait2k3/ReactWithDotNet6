import { FC } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";

import { Product } from "../../app/models/product";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from '../../app/store/configure-store';
import { addBasketItemAsync } from '../basket/basket-slice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  const handleAddItem = (productId: number) => {
    dispatch(addBasketItemAsync({productId}));
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }} aria-label="recipe">
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: {
            fontWeight: "bold",
            color: "primary.main",
          },
        }}
      />
      <CardMedia
        component="img"
        sx={{ height: 140, objectFit: "contain", bgcolor: "primary.light" }}
        image={product.pictureUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={status === ("pendingAddItem" + product.id)}
          size="small"
          onClick={() => handleAddItem(product.id)}
        >
          Add to cart
        </LoadingButton>
        <Button size="small" component={Link} to={`/catalog/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

import { FC } from "react";
import { Grid } from "@mui/material";

import { Product } from "../../app/models/product";
import ProductCard from "./product-card";
import { useAppSelector } from '../../app/store/configure-store';
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductListProps {
  products: Product[];
}

const ProductList: FC<ProductListProps> = (props) => {
  const { productsLoaded } = useAppSelector(state => state.catalog);

  return (
    <Grid container spacing={4}>
      {props.products.map(product => (
        <Grid item xs={4} key={product.id}>
          {!productsLoaded ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product}/>
          )}
        </Grid> 
      ))}
    </Grid>
  );
};

export default ProductList;

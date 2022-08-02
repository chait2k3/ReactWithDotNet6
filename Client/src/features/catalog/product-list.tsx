import { FC } from "react";
import { Grid } from "@mui/material";

import { Product } from "../../app/models/product";
import ProductCard from "./product-card";

interface ProductListProps {
  products: Product[];
}

const ProductList: FC<ProductListProps> = (props) => {
  return (
    <Grid container spacing={4}>
      {props.products.map(product => (
        <Grid item xs={3} key={product.id}>
          <ProductCard product={product}/>
        </Grid> 
      ))}
    </Grid>
  );
};

export default ProductList;

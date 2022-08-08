import { useEffect } from "react";

import ProductList from "./product-list";
import LoadingComponent from '../../app/layout/loading-component';
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import { productSelectors, fetchProductsAsync } from './catalog-slice';

const Catalog = () => {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded,dispatch]);

  if (status.includes("pending")) return <LoadingComponent  message="Loading products..."/>;

  return (
    <ProductList products={products}/>
  );
};

export default Catalog;

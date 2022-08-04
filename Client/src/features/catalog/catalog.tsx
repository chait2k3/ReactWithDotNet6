import { useState, useEffect } from "react";

import agent from '../../app/api/agent';
import { Product } from "../../app/models/product";

import ProductList from "./product-list";
import LoadingComponent from '../../app/layout/loading-component';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.list()
      .then(data => setProducts(data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent  message="Loading products..."/>;

  return (
    <ProductList products={products}/>
  );
};

export default Catalog;

import { useState, useEffect } from "react";
import axios from 'axios';

import ProductList from "./product-list";

import { Product } from "../../app/models/product";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("https://localhost:5000/api/Products")
      .then(resp => {
        setProducts(resp.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <ProductList products={products}/>
  );
};

export default Catalog;

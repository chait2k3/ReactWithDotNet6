import { useState, useEffect } from "react";

import ProductList from "./product-list";

import { Product } from "../../app/models/product";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://localhost:5000/api/Products")
      .then((resp) => resp.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <ProductList products={products}/>
  );
};

export default Catalog;

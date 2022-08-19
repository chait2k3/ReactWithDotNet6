import { Grid, Paper } from "@mui/material";

import ProductList from "./product-list";
import LoadingComponent from "../../app/layout/loading-component";
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import {
  setProductParams,
  setPageNumber,
} from "./catalog-slice";
import ProductSearch from "./product-search";
import RadioButtonGroup from "../../app/components/radio-button-group";
import CheckboxButtons from "../../app/components/checkbox-buttons";
import AppPagination from "../../app/components/app-pagination";
import useProducts from '../../app/hooks/useProducts';

const sortOptions = [
  { label: "Alphabetical", value: "name" },
  { label: "Price - High to low", value: "priceDesc" },
  { label: "Price - Low to high", value: "price" },
];
const Catalog = () => {
  const { products, filtersLoaded,brands,types,metaData} = useProducts();
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            options={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={(event) =>
              dispatch(setProductParams({ orderBy: event.target.value }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands || []}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ brands: items }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types || []}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ types: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2}}>
        {metaData && (
          <AppPagination 
          metaData={metaData}
          onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} 
        />
        )}
      </Grid>
    </Grid>
  );
};

export default Catalog;

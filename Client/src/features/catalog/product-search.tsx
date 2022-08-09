import { debounce, TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from '../../app/store/configure-store';
import { setProductParams } from "./catalog-slice";
import { useState } from 'react';

const ProductSearch = () => {
    const { productParams } = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}));
    }, 1000);

    const handleOnChange = (event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
    };

    return (
        <TextField 
            label="Searc products" 
            variant="outlined" 
            fullWidth
            value={searchTerm || ""}
            onChange={ handleOnChange } 
        />
    );
};

export default ProductSearch;
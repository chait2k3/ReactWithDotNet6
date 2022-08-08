import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { basketSlice } from '../../features/basket/basket-slice';
import { catalogSlice } from "../../features/catalog/catalog-slice";
import { counterSlice } from '../../features/contact/counter-slice';

// old redux code
/* 
import { createStore } from "redux";
import counterReducer from '../../features/contact/counter-reducet';
import { useDispatch } from 'react-redux';
import { basketSlice } from '../../features/basket/basket-slice';
import { catalogSlice } from '../../features/catalog/catalog-slice';
 export const configureStore = () => {
     return createStore(counterReducer);
 };
*/ 

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        catalog: catalogSlice.reducer,
        basket: basketSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 
import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number,
    title: string
}

const initialState: CounterState = {
    data: 45,
    title: "Yet another redux counter"
};

export const counterSlice = createSlice({
    name: "coumter",
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload;
        },
        decrement: (state, action) => {
            state.data -= action.payload;
        }
    }
});

export const {increment, decrement} = counterSlice.actions;

import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { User } from "../../app/models/user";
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';
import { setBasket } from '../basket/basket-slice';

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const signInUserAsync = createAsyncThunk< User, FieldValues>(
   "account/signInUserAsync",
   async (data, thunkAPI) => {
    try {
        const userDTO = await agent.Account.login(data) as User;
        const {basket, ...user} = userDTO;
        if(basket) thunkAPI.dispatch(setBasket(basket));

        localStorage.setItem("user", JSON.stringify(user));
        return user;
    } catch (error: any) {
        console.log(error);
        return thunkAPI.rejectWithValue({error: error.data});
    }            
   }
);

export const fetchCurrentUserAsync = createAsyncThunk<User>(
    "account/fetchCurrentUserAsync",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
     try {
         const userDTO = await agent.Account.currentUser();
         const {basket, ...user} = userDTO;
        if(basket) {
            thunkAPI.dispatch(setBasket(basket));
        }
        
         localStorage.setItem("user", JSON.stringify(user));
         return user;
     } catch (error: any) {
         console.log(error);
         return thunkAPI.rejectWithValue({error: error.data});
     }            
    },
    {
        condition: () => {
            if(!localStorage.getItem("user")) return false;
        }
    }
);
 
export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUser: (state, action) => {
            //extract roles from the token
            let claims = JSON.parse(atob(action.payload.token.split(".")[1]));
            let roles = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
        },
        signOut: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUserAsync.rejected, (state) => {
            state.user = null;
            localStorage.removeItem("user");
            toast.error("Session expired... Please log in again.");
        });
        builder.addMatcher(
            isAnyOf(signInUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled),
            (state, action) => {
                //extract roles from the token
                const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
                const roles = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
            }
        );
        builder.addMatcher(
            isAnyOf(signInUserAsync.rejected, fetchCurrentUserAsync.rejected),
            (_, action) => {
                throw action.payload;
            }
        );    
    }
});

export const { setUser, signOut } = accountSlice.actions;

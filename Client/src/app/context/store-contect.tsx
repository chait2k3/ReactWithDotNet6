import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import { Basket } from "../models/basket";

interface StoreContextValue {
    basket: Basket | null,
    setBasket: (basket: Basket) => void,
    removeItem: (productId: number, quantity: number) => void
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const useStoreContext = () => {
    const context = useContext(StoreContext);

    if(context === undefined) {
        throw Error("Oops - we do not seem to be inside a provider.");
    }

    return context;
};

export const StoreContextProvider: FC<PropsWithChildren<any>> = ({ children }) => {
    const [basket, setBasket] = useState<Basket | null>(null);

    const removeItem = (productId: number, quantity: number) => {
        if(!basket) return;

        const items = [...basket.items];
        const itemIndex = items.findIndex(i => i.productId === productId);
        // if item not present then rerurn
        if(itemIndex === -1) return;

        // reduce the quantity
        items[itemIndex].quantity -= quantity;
        // if quantity is 0 then remove the item
        if(items[itemIndex].quantity === 0) {
            items.splice(itemIndex, 1);
        }

        setBasket(prevState => {
            return {...prevState!, items};
        });
    };

    return (
        <StoreContext.Provider 
        value={{
            basket, 
            setBasket,
            removeItem
        }}>
            {children}
        </StoreContext.Provider>
    );
};


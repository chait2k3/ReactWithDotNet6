import { Basket } from "./basket";

export interface User {
    email: string;
    token: string;
    roles?: string[];
    basket?: Basket;
}
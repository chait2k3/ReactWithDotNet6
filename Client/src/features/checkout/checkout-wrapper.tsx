import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./checkout-page";
import { useAppDispatch } from '../../app/store/configure-store';
import { useState, useEffect } from 'react';
import agent from '../../app/api/agent';
import { setBasket } from "../basket/basket-slice";
import LoadingComponent from "../../app/layout/loading-component";

const stripePromise = loadStripe("<Stripe Publishable key>");

const CheckoutWrapper = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(data => dispatch(setBasket(data)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if(loading) return <LoadingComponent message="Loading checkout..." />;

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    );
};

export default CheckoutWrapper;
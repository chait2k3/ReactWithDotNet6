import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState, useEffect } from 'react';
import { FormProvider, useForm, FieldValues } from 'react-hook-form';
import AddressForm from "./address-form";
import PaymentForm from "./payment-form";
import Review from "./review";
import { yupResolver } from '@hookform/resolvers/yup'; 
import { validationSchema } from './checkout-validation';
import agent from '../../app/api/agent';
import { useAppDispatch, useAppSelector } from '../../app/store/configure-store';
import { clearBasket } from "../basket/basket-slice";
import { LoadingButton } from '@mui/lab';
import { StripeElementType } from "@stripe/stripe-js";
import { useElements, useStripe, CardNumberElement } from '@stripe/react-stripe-js';

const steps = ["Shipping address", "Review your order", "Payment details"];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [cardState, setCardState] = useState<{elementError: {[key in StripeElementType]?: string}}>({ elementError: {} });
  const [cardComplete, setCardComplete] = useState<any>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  // for stripe payment
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const {basket} = useAppSelector(state => state.basket);
  const stripe = useStripe();
  const elements = useElements();

  const onCardInputChanged = (event: any) => {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message
      }
    });

    setCardComplete({...cardComplete, [event.elementType]: event.complete});
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return <PaymentForm cardState={cardState} onCardInputChanged={onCardInputChanged}/>;
      default:
        throw new Error("Unknown step");
    }
  };

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema)
  });

  useEffect(() => {
    agent.Account.fetchAddress()
         .then(response => {
          if(response) {
              methods.reset({
                ...methods.getValues(),
                ...response,
                saveAddress: false
              });
          }
         })
         .catch(error => console.log(error)); 
  }, [methods]);

  const submitOrder = async (data: FieldValues) => {
    setLoading(true);
    const { nameOnCard, saveAddress, ...shippingAddress} = data;
    if(!stripe || !elements) return; // stripe is not ready

    try {
      const cardElement = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: nameOnCard
          }
        }
      });

      // if payment is successful then only create the order
      if(paymentResult.paymentIntent?.status === "succeeded") {
          const orderNo = await agent.Orders.create({saveAddress, shippingAddress});
          setOrderNumber(orderNo);
          setPaymentSucceeded(true);
          setPaymentMessage("Thank you - we have received your payment.");
          setActiveStep(activeStep + 1);
          dispatch(clearBasket());
          setLoading(false);
      } 
      else {
        setPaymentSucceeded(false);
        setPaymentMessage(paymentResult.error?.message!);
      }
    } catch(error) {
      console.log(error);
      setLoading(false);
      setLoading(false);
      setActiveStep(activeStep + 1);
    }
  };

  const handleNext = async (data: FieldValues) => {
    if(activeStep === steps.length - 1) {
      await submitOrder(data);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const submitDisabled = (): boolean => {
    if(activeStep === steps.length - 1) {
      return !cardComplete.cardCvc
             || !cardComplete.cardExpiry
             || !cardComplete.cardNumber
             || !methods.formState.isValid; 
    } else {
      return !methods.formState.isValid;
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                { paymentMessage }
              </Typography>
              { paymentSucceeded && (
                <Typography variant="subtitle1">
                Your order number is #{orderNumber}. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
              )}
              { !paymentSucceeded && (
                <Button variant="contained" onClick={handleBack}>
                  Go back and try again
                </Button>
              )}
              
            </>
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading = {loading}
                  disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  { activeStep === (steps.length - 1) && "Place order"}
                  { activeStep !== (steps.length - 1) && "Next"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
};

export default CheckoutPage;

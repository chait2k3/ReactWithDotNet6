import { Typography, Grid, TextField, FormControlLabel, Checkbox } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/app-textinput";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import StripeInput from './stripe-input';
import { FC } from 'react';
import { StripeElementType } from "@stripe/stripe-js";

interface PaymentFormProps {
  cardState: {elementError: {[key in StripeElementType]?: string}},
  onCardInputChanged: (event: any) => void
}

const PaymentForm: FC<PaymentFormProps> = ({cardState, onCardInputChanged}) => {
  const { control } = useFormContext();
    
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextInput name="nameOnCard" label="Name on card" control={control} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="cardNumber"
            label="Card number"
            onChange={onCardInputChanged}
            error={!!cardState.elementError.cardNumber}
            helperText={cardState.elementError.cardNumber}
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="expDate"
            label="Expiry date"
            onChange={onCardInputChanged}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="cvv"
            label="CVV"
            onChange={onCardInputChanged}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentForm;
import { Typography, Grid } from "@mui/material";
import { useFormContext } from 'react-hook-form';
import AppCheckBox from "../../app/components/app-checkbox";
import AppTextInput from '../../app/components/app-textinput';

const AddressForm = () => {
  const { control, formState } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <AppTextInput name="fullName" label="Full name" control={control}/>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput name="address1" label="Address line 1" control={control}/>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput name="address2" label="Address line 2" control={control}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput name="city" label="City" control={control}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput name="state" label="State/Province/Region" control={control}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput name="zip" label="Zip / Postal Code" control={control}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput name="country" label="Country" control={control}/>
        </Grid>
        <Grid item xs={12}>
          <AppCheckBox 
            name="saveAddress" 
            label="Save this as the default address"
            disabled={!formState.isDirty} 
            control={control}/>
        </Grid>
      </Grid>
    </>
  );
};

export default AddressForm;

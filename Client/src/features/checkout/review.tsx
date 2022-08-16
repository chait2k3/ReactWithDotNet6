import { Grid, Typography } from '@mui/material';
import BasketSummary from '../basket/basket-summary';
import BasketTable from '../basket/basket-table';
import { useAppSelector } from '../../app/store/configure-store';

const Review = () => {
  const { basket } = useAppSelector(state => state.basket);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && <BasketTable items={basket.items} isBasket={false} /> }
      <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6} >
          <BasketSummary />
        </Grid>          
      </Grid>
    </>
  );
};

export default Review;

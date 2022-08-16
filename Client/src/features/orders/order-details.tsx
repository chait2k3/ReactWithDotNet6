import { Box, Typography, Button, Grid } from "@mui/material";
import { FC } from "react";
import { BasketItem } from "../../app/models/basket";
import { Order } from "../../app/models/order";
import BasketSummary from "../basket/basket-summary";
import BasketTable from "../basket/basket-table";

interface OrderDetailsProps {
    order: Order;
    setSelectedOrder: (id: number) => void;
}

const OrderDetails: FC<OrderDetailsProps> = (props) => {
    const subtotal = props.order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {props.order.id} - {props.order.orderStatus}
        </Typography>
        <Button
          onClick={() => props.setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <BasketTable items={props.order.orderItems as BasketItem[]} isBasket={false} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </>
  );
};

export default OrderDetails;

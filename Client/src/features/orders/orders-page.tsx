import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { Order } from "../../app/models/order";
import agent from '../../app/api/agent';
import LoadingComponent from "../../app/layout/loading-component";
import { currencyFormat } from '../../app/utils/utils';
import OrderDetails from "./order-details";

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

    useEffect(() => {
        agent.Orders.list()
            .then(data => setOrders(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    },[]);

    if(loading) return <LoadingComponent message="Loading orders..." />;
    
    if (selectedOrderNumber > 0) return (
      <OrderDetails 
          order={orders?.find(o => o.id === selectedOrderNumber)!}
          setSelectedOrder={setSelectedOrderNumber}
      />
  )

    return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{currencyFormat(order.total)}</TableCell>
              <TableCell align="right">{order.orderDate.split("T")[0]}</TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right">
                <Button onClick={() => setSelectedOrderNumber(order.id)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
};

export default OrdersPage;

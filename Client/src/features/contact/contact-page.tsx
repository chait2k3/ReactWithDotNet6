import { Fragment } from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/store/configure-store";
import { decrement, increment } from "./counter-slice";

const ContactPage = () => {
  const { data, title } = useAppSelector(state => state.counter);
  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is: {data}</Typography>
      <ButtonGroup>
        <Button variant="contained" color="error" onClick={() => dispatch(decrement(1))}>Decrement</Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(increment(1))}>Increment</Button>
        <Button variant="contained" color="secondary" onClick={() => dispatch(increment(5))}>Increment by 5</Button>
      </ButtonGroup>
    </Fragment>
  );
};

export default ContactPage;

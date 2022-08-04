import { Button, Divider, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  error: {
    detail: string;
    title: string;
    status: number;
  };
}

const ServerError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state as LocationState;

  let content = (
    <Typography variant="h5" gutterBottom>
      Server Error! Something went wrong...
    </Typography>
  );

  if (error) {
    content = (
      <>
        <Typography variant="h3" color='error' gutterBottom>
          {error.title}
        </Typography>
        <Divider />
        <p>{error.detail || "Internal server error..."}</p>
      </>
    );
  }

  return ( 
   <Container component={Paper}>
    {content}
    <Button variant="contained" onClick={() => navigate('/catalog')} >Return to store</Button>
    <br />
    <br />
    <br />
  </Container>
  )
};

export default ServerError;

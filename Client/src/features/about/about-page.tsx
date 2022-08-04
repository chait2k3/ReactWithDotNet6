import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Button, ButtonGroup, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Container } from "@mui/system";
import agent from "../../app/api/agent";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const getValidationError = () => {
    agent.TestErrors.getValidationError()
    .catch((error) => {
      const {errors} = error.data;
      if (errors) {
        const modelStateErrors: string[] = [];
        for (const key in errors) {
            if (errors[key]) {
                modelStateErrors.push(errors[key])
            }
        }
        setValidationErrors(modelStateErrors.flat());
    }
    })
  };
 
  const getServerError = () => {
    agent.TestErrors.get500Error().catch((error) => {
      console.log(error);
      navigate('/server-error', {state: {error: error.data}});
    })
  };

  return (
    <Container>
      <Typography gutterBottom variant="h3">
        Errors for testing purpose
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get400Error().catch((error) => console.log(error))
          }>
            400 - Bad request
          </Button>
          <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get401Error().catch((error) => console.log(error))
          }>
            401 Unauthorized
          </Button>
          <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get404Error().catch((error) => console.log(error))
          }>
            404 Not found
          </Button>
          <Button
          variant="contained"
          onClick={getServerError}>
            500 Server error
          </Button>
          <Button
          variant="contained"
          onClick={getValidationError}>
            Validation error
          </Button>  
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity='error'>
          <AlertTitle>Validation Error</AlertTitle>
          <List>
            {validationErrors.map(error => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  
  );
};

export default AboutPage;

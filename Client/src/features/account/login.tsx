import { FieldValues, useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from "../../app/store/configure-store";
import { signInUserAsync } from './account-slice';

interface LocationState {
  from: {
    pathname: string;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  let state:LocationState;
  if(location.state)
  {
    state = location.state as LocationState ;
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  const submitForm = async (data: FieldValues) => {
    try {
      await dispatch(signInUserAsync(data));
      
      if(state?.from?.pathname) {
        navigate(state?.from?.pathname);
      } else {
        navigate("/catalog");
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Log In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="User Name"
          autoFocus
          {...register("username", { required: true })}
          error={!!errors.username}
          helperText={errors.username ? "User name is required" : ""}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          {...register("password", { required: true })}
          error={!!errors.password}
          helperText={errors.password ? "Password is required" : ""}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/register">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;

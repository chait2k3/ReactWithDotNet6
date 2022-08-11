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
import { Link, useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  const submitForm = async (data: FieldValues) => {
    agent.Account.register(data)
      .then(() => {
        navigate("/login");
        toast.success("Your registration is successful!! Please login now");
      })
      .catch((error) => {
        const { errors: err } = error.data;
        if (err) {
          const modelStateErrors: string[] = [];
          for (const key in err) {
            if (err[key]) {
              modelStateErrors.push(err[key]);
            }
          }
          // console.log(modelStateErrors);
          // console.log(modelStateErrors.flat());
          modelStateErrors.flat().forEach(e => {
            if(e.includes("Password")) {
                setError("password", {message: e});
            } else if(e.includes("Email")) {
                setError("email", {message: e});
            }else if(e.includes("Username")) {
                setError("username", {message: e});
            }
          });
        }
      });
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
        Register
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
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message!.toString()}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email address"
          {...register("email", { 
            required: "Email is required",
            pattern: {
                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*)).[a-z]{2,3}$/,
                message: 'Not a valid email address'
            }
        })}
          error={!!errors.email}
          helperText={errors.email?.message!.toString()}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          {...register("password", { 
            required: "Password is required",
            pattern: {
                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: 'Password is not complex enough'
            }
        })}
          error={!!errors.password}
          helperText={errors.password?.message!.toString()}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login">{"Already have an account? Log In"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;

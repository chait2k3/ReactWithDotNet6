import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { signOut } from "../../features/account/account-slice";
import { useAppDispatch, useAppSelector } from '../store/configure-store';
import { Link, useNavigate } from 'react-router-dom';
import { clearBasket } from "../../features/basket/basket-slice";

const SignedInMenu = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.account);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button 
        color="inherit"
        onClick={handleClick}
        sx={{ typography: "h6" }}
       >
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem component={Link} to="/orders" >My orders</MenuItem>
        <MenuItem onClick={()=>{
            dispatch(signOut());
            dispatch(clearBasket());
            navigate("/");
        }}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default SignedInMenu;

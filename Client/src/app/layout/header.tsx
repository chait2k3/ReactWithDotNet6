import { FC } from "react";
import {
  AppBar,
  Badge,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useAppSelector } from "../store/configure-store";
import SignedInMenu from "./signedin-menu";

interface HeaderProps {
  darkMode: boolean;
  onThemeChange: () => void;
}

const midLinks = [
  { title: "Catalog", path: "/catalog" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const rightLinks = [
  { title: "Login", path: "/login" },
  { title: "Register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  typography: "h6",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
  },
};

const Header: FC<HeaderProps> = (props) => {
  const { user } = useAppSelector((state) => state.account);
  const { basket } = useAppSelector((state) => state.basket);
  const itemCount = basket?.items.reduce((acc, currItem) => {
    return acc + currItem.quantity;
  }, 0);

  return (
    <AppBar position="static" sx={{ marginBottom: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            Shopping App
          </Typography>
          <Switch checked={props.darkMode} onChange={props.onThemeChange} />
        </Box>

        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {title}
            </ListItem>
          ))}
          { user && user.roles?.includes("ADMIN") && (
          <ListItem component={NavLink} to='/inventory' sx={navStyles}>
              Inventory
          </ListItem>
          )}
        </List>

        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            sx={{ color: "inherit" }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user && <SignedInMenu />}
          {!user && (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

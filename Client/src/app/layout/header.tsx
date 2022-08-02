import { FC } from "react";
import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface HeaderProps {
    darkMode: boolean,
    onThemeChange: () => void 
}

const Header: FC<HeaderProps> = (props) => {
    return (
        <AppBar position="static" sx={{ marginBottom: 4 }}>
            <Toolbar>
                <Typography variant="h6">
                    Shopping App
                </Typography>
                <Switch checked={props.darkMode} onChange={props.onThemeChange}/>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
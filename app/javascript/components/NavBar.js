import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const NavBar = () => {
    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar
                position="sticky">
                <Toolbar>
                    <Typography
                        variant="h5"
                        component="div"
                    >
                        Todolister
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar
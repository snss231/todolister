import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Search from './Search';
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

const theme = createTheme({
    palette: {
        primary:{
            main: '#fff'
        }
    }
});

const NavBar = ({ handleNewList, onSearch }) => {
    const [anchor, setAnchor] = useState();
    const [name, setName] = useState('');

    const notXs = useMediaQuery('(min-width:600px)');
     
    const open = Boolean(anchor);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar
                position="sticky">
                <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
                    <Typography sx={{cursor:'pointer'}}
                        variant={notXs ? 'h5' : 'h6'}
                        component="div"
                        onClick={()=>window.location.reload()}>
                    Todolister
                    </Typography>
                    <Search onSearch={onSearch}/>
                    <ThemeProvider theme={theme}>
                        <Button color='primary' variant='outlined' startIcon={<AddIcon/>} sx={{whiteSpace:'nowrap'}}
                            onClick={e => {setAnchor(e.currentTarget)}}>
                            New List
                        </Button>
                    </ThemeProvider>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchor}
                        onClose={() => setAnchor(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <form onSubmit={e => {handleNewList(e, name); setName(''); setAnchor(null)}}>
                            <Typography sx={{p:1}}>Enter the name of the new todolist:</Typography>
                            <TextField sx={{p:1}} variant='standard'
                                inputProps={{required:'required'}}
                                onChange={e => setName(e.target.value)} 
                                name="name" value={name} 
                                placeholder="Sunday shopping list"/>
                            <Button type='submit'><AddIcon/></Button>
                        </form>
                    </Popover>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar
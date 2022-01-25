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

const NavBar = ({ handleNewList, onSearch }) => {
    const [anchor, setAnchor] = useState()
    const [name, setName] = useState('')
     
    const open = Boolean(anchor)
    const id = open ? 'simple-popover' : undefined

    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar
                position="sticky">
                <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
                    <Typography
                        variant="h5"
                        component="div">
                    Todolister
                    </Typography>
                    <Search onSearch={onSearch}/>
                    <Button color='primary' variant='contained' startIcon={<AddIcon/>}
                        onClick={e => {setAnchor(e.currentTarget)}}>
                        New List
                    </Button>
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
                        <form onSubmit={e => handleNewList(e, name)}>
                            <Typography sx={{p:1}}>Enter the name of the new todolist:</Typography>
                            <TextField sx={{p:1}} variant='standard'
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
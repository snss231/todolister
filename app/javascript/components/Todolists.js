import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Grid, Box } from '@mui/material'
import NavBar from './NavBar'
import SearchBar from './SearchBar'

const Todolists = () => {
    const [todolists, setTodolists] = useState([])
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])


    const lists = todolists.map( item => {
        return (<Grid item key={item.id} xs={12} sm={6} md={4} lg={3} >
            <Todolist id={item.id} attributes={item.attributes}/>
            </Grid>)
    })

    return (
        <div className="App">
            <NavBar/>
            <SearchBar tasks={tasks} lists={todolists}/>
            <Box ml={1} mr={1} mt={1}>
                <Grid container spacing={2}>{lists}</Grid>
            </Box>
        </div>
    )
}

export default Todolists
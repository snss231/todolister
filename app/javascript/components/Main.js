import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Grid, Box } from '@mui/material'
import NavBar from './NavBar'

const Main = () => {
    const [todolists, setTodolists] = useState([])
    const [tasks, setTasks] = useState([])
    const [view, setView] = useState('listView')

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])

    const handleDeleteList = (e, id) => {
        e.preventDefault()
        axios.delete(`/api/v1/todolists/${id}`)
             .then(resp => {
                 setTodolists(todolists.filter(list => list.id !== id))
             })
    }

    const handleNewList = (e, name) => {
        e.preventDefault()
        const todolist = { name: name }
        axios.post('/api/v1/todolists', {todolist})
             .then(resp => {
                setTodolists([...todolists, resp.data.data])
             })
             .catch(resp => console.log(resp))
    }




    const listView = () => {
        const lists = todolists.map( item => 
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3} >
                    <Todolist id={item.id} attributes={item.attributes} handleDeleteList={handleDeleteList}/>
                </Grid>)

        return (<Grid container spacing={2}>{lists}</Grid>)
    }

    const searchView = () => {
        const tasks = tasks.map( task => {

        })
        return (
            <Grid container spacing={2}>{lists}</Grid>
        )
    }

    const getView = () => {
        switch(view) {
            case 'listView':
                return listView();
            case 'searchView':
                return searchView();
            default:
                console.log('invalid view')
        }
    }

    return (
        <div className="App">
            <NavBar tasks={tasks} lists={todolists} handleNewList={handleNewList}/>
            <Box className='content' ml={1} mr={1} mt={1}>
                {getView()}
            </Box>
            <div id='hi'>Woah</div>
            <a href="#hi">hehe</a>
        </div>
    )
}

export default Main
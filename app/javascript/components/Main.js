import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Grid, Box, createTheme, ThemeProvider, Paper } from '@mui/material'
import NavBar from './NavBar'
import Task from './Task'
import ViewOptions from './ViewOptions'

const Main = () => {
    const [todolists, setTodolists] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [tasks, setTasks] = useState([])
    const [view, setView] = useState('listView')

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    })

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])

    const onSearch = (filter) => {
        if (filter == '') {
            setView('listView')
        } else {
            setFilteredTasks(tasks.filter(task => task.attributes.name.includes(filter)))
            setView('searchView')
        }
    }

    const onAbortSearch = () => {
        setView('listView')
    }

    const handleDeleteList = (e, id) => {
        e.preventDefault()
        axios.delete(`/api/v1/todolists/${id}`)
             .then(resp => {
                 setTodolists(todolists.filter(list => list.id !== id))
             })
    }

    const handleDeleteTask = (e, taskId) => {
        e.preventDefault()
        console.log(taskId)
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id === taskId))
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
        const lists = todolists.map(({ id, attributes }) => {
            return <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Todolist id={id} 
                    attributes={attributes} 
                    handleDeleteList={handleDeleteList}
                    handleDeleteTask={handleDeleteTask}
                    />
                </Grid>
        })
        return (<Grid container spacing={2}>{lists}</Grid>)
    }

    const searchView = () => {
        const taskList = filteredTasks.map(({ attributes, id }) => {  
            const { name, description, due_date, completed } = attributes;
            return (<Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Task
                    name={name} 
                    description={description} 
                    id={id}
                    due_date={due_date === null ? null : new Date(due_date)}
                    completed={completed}
                    handleDelete={handleDeleteTask}/>
                </Grid>)
        })
        return (
            filteredTasks.length !== 0 
                ? <Grid container spacing={2}>{taskList}</Grid> 
                : <div>No tasks found with that search term. Try a different keyword?</div>
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
        <ThemeProvider theme={theme}>
            <div className="App">
                <NavBar handleNewList={handleNewList}
                    onAbortSearch={onAbortSearch}
                    onSearch={onSearch}/>
                <ViewOptions/>
                <Paper style={{height:'100%'}}>
                    <Box className='content' ml={1} mr={1} mt={1}>
                        {getView(view)}
                    </Box>
                </Paper>
            </div>
        </ThemeProvider>
    )
}

export default Main
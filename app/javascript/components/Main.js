import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Grid, Box, createTheme, ThemeProvider, Paper, Switch, FormControlLabel } from '@mui/material'
import NavBar from './NavBar'
import Task from './Task'
import ViewOptions from './ViewOptions'



const Main = () => {
    const [todolists, setTodolists] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState([])
    const [view, setView] = useState('listView')
    const [showCompleted, setShowCompleted] = useState(false)

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    })

    const update = () => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
            setTasks(resp.data.included)
            setFilteredTasks(resp.data.included.filter(task => task.attributes.name.includes(filter)))
        })
        .catch(resp => console.log(resp))
    }

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])

    const onSearch = (filter) => {
        setFilter(filter)
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

    const handleNewList = (e, name) => {
        e.preventDefault()
        const todolist = { name: name }
        axios.post('/api/v1/todolists', {todolist})
             .then(resp => {
                setTodolists([...todolists, resp.data.data])
             })
             .catch(resp => console.log(resp))
    }

    const handleDeleteList = (id) => {
        axios.delete(`/api/v1/todolists/${id}`)
             .then(resp => {
                 setTodolists(todolists.filter(list => list.id !== id))
             })
    }

    const handleDeleteTask = (taskId) => {
        console.log(taskId)
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id === taskId))
            update()
        })
    }

    const handleMarkTask = (task, taskId) => {
        //e.preventDefault()
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
        .then(resp => {setTasks([])
            update()})
            //todo
            
        .catch()
    }

    const handleUnmarkTask = (task, taskId) => {
       //e.preventDefault()
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
        .then(resp => {setTasks([])
            //todo
            update()
        })
    }

    const handleEditTask = (task, taskId) => {
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
             .then(resp => {setTasks([])
                update()
             })
             .catch()
    }

    const listView = () => {
        return (<Grid container spacing={2}>{lists()}</Grid>)
    }

    const searchView = () => {
        const taskList = filteredTasks
            .filter(({attributes}) => !attributes.completed || showCompleted)
            .map(({ attributes, id }) => {  
            const { name, description, due_date, completed } = attributes;
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                    <Task
                        name={name} 
                        description={description} 
                        id={id}
                        due_date={due_date === null ? null : new Date(due_date)}
                        completed={completed}
                        handleDelete={handleDeleteTask}
                        handleMark={handleMarkTask}
                        handleUnmark={handleUnmarkTask}
                        handleEdit={handleEditTask}/>
                </Grid>
           
            )
        })
        return (
            <Box>
                <FormControlLabel control={<Switch onChange={()=>setShowCompleted(!showCompleted)}/>} label="show completed tasks"/>
                {filteredTasks.length !== 0 
                    ? <Grid container spacing={2}>{taskList}</Grid> 
                    : <div>No tasks found with that search term. Try a different keyword?</div>}
            </Box>
                
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

    const lists = () => todolists.map(({ id, attributes }) => {
        return (
       
            <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Todolist id={id} 
                    attributes={attributes} 
                    update={update}
                    handleDeleteList={handleDeleteList}/>
            </Grid>
        )
    })
    return (
        <ThemeProvider theme={theme}>
            <div className="App" style={{height:"100%"}}>
                <NavBar handleNewList={handleNewList}
                    onAbortSearch={onAbortSearch}
                    onSearch={onSearch}/>
                <Box className='content' ml={1} mr={1} mt={1}>
                    {getView(view)}
                </Box>
            </div>
        </ThemeProvider>
    )
}

export default Main
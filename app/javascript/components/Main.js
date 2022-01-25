import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Todolist from './Todolist';
import { Grid, Box, createTheme, ThemeProvider, Switch, FormControlLabel } from '@mui/material';
import NavBar from './NavBar';
import Task from './Task';

const Main = () => {
    const [todolists, setTodolists] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState([]);
    const [view, setView] = useState('listView');
    const [showCompleted, setShowCompleted] = useState(false);

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data);
            setTasks(resp.data.included);
        })
        .catch(resp => console.log(resp));
    }, []);

    const onSearch = (filter) => {
        setFilter(filter);
        if (filter == '') {
            setView('listView');
        } else {
            setFilteredTasks(tasks.filter(task => task.attributes.name.toLowerCase().includes(filter.toLowerCase())));
            setView('searchView');
        }
    };

    const onAbortSearch = () => {
        setView('listView');
    };

    const handleNewList = (e, name) => {
        e.preventDefault();
        const todolist = { name };
        axios.post('/api/v1/todolists', { todolist })
        .then(resp => {
            console.log(resp.data.data)
            setTodolists([...todolists, resp.data.data]);
        })
    };

    const handleDeleteList = (id) => {
        axios.delete(`/api/v1/todolists/${id}`)
        .then(resp => {
            setTodolists(todolists.filter(list => list.id !== id));
        });
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id !== taskId));
        });
    };

    const handleUpdateTask = (task, taskId) => {
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
        .then(resp => {
            const updatedTasks = [...tasks.filter(t => t.id !== taskId), {attributes: task, id: taskId}]
            setTasks(updatedTasks);
            setFilteredTasks(
                updatedTasks.filter(t => t.attributes.name.toLowerCase().includes(task.name.toLowerCase()))
            );
        })
    };

    const onTodolistUpdateTask = (task, taskId) => {
        setTasks(tasks.map(t => t.id === taskId ? {id: taskId, attributes: task} : t));
    };

    const onTodolistCreateTask = (task) => {
        setTasks([...tasks, task]);
    };

    const onTodolistDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    }

    const listView = () => {
        return (<Grid container spacing={2}>{lists()}</Grid>);
    };

    const searchView = () => {
        const displayedTasks = filteredTasks
        .filter(({attributes}) => showCompleted || !attributes.completed)
        .map(({ attributes, id }) => {  
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                    <Task
                        id={id}
                        attributes={attributes}
                        handleDelete={handleDeleteTask}
                        handleUpdate={handleUpdateTask}/>
                </Grid>
            );
        });
        console.log('rerender search')
        console.log(filteredTasks.map(task => task.attributes))
        return (
            <Box>
                <FormControlLabel control={<Switch onChange={()=>setShowCompleted(!showCompleted)}/>} label="show completed tasks"/>
                {filteredTasks.length !== 0 
                    ? <Grid container spacing={2}>{displayedTasks}</Grid> 
                    : <div>No tasks found with that search term. Try a different keyword?</div>}
            </Box> 
        );
    };

    const getView = () => {
        switch(view) {
            case 'listView':
                return listView();
            case 'searchView':
                return searchView();
            default:
                console.log('invalid view');
        }
    };

    const lists = () => todolists.map(({ id, attributes }) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Todolist id={id} 
                    attributes={attributes} 
                    onUpdateTask={onTodolistUpdateTask}
                    onDeleteTask={onTodolistDeleteTask}
                    onCreateTask={onTodolistCreateTask}
                    handleDeleteList={handleDeleteList}/>
            </Grid>
        );
    });
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
    );
};

export default Main
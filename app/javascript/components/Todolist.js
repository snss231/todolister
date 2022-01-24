import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Task from './Task'
import TaskForm from './TaskForm' 
import { Dialog, DialogTitle, DialogActions, IconButton, Button, TextField, Box, Typography, Collapse, Fade} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

 
const Todolist = ({ id, attributes, handleDeleteList, update }) => {
    const [tasks, setTasks] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [listName, setListName] = useState(attributes.name)
    const [editingName, setEditingName] = useState()
    const [activeAddTask, setActiveAddTask] = useState(false)
    const [showButtons, setShowButtons] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const csrfToken = document.querySelector('[name=csrf-token]').content
    const [expanded, setExpanded] = useState(false)
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    useEffect(() => {
        axios.get(`/api/v1/todolists/${id}`)
        .then(resp => {
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [tasks.length])
    
    const handleSubmit = (e, task) => {
        e.preventDefault()
        
        const todolist_id = id

        axios.post('/api/v1/tasks', {task, todolist_id})
        .then(resp => {
            const updatedTasks = [ ...tasks, resp.data.data ]
            setTasks(updatedTasks)
            update()
        })
    }


    const handleChange = e => {
        e.preventDefault()
        setEditingName(e.target.value)
    }

    const handleSubmitRename = e => {
        e.preventDefault()
        const name = editingName
        axios.patch(`/api/v1/todolists/${id}`, {todolist: {name: name}})
             .then(resp => {
                setEditMode(false);
                setListName(name)
                update()
             })
        
    }

    const handleDeleteTask = (taskId) => {
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id === taskId))
            update()
        })
    }

    const handleMarkTask = (task, taskId) => {
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
        .then(resp => {setTasks([])
            update()
        })
    }

    const handleUnmarkTask = (task, taskId) => {
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
             .then(resp => {setTasks([])
                 update()
             })
    }

    const handleEditTask = (task, taskId) => {
        console.log(task)
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
             .then(resp => {setTasks([])
                update()
             })
    }



    const incompleteTasks = tasks.filter(({attributes}) => !attributes.completed)
                                  .map(({id, attributes}) => {
        const { name, description, due_date, completed, label } = attributes;
        return (<Task
                key={id}
                name={name} 
                description={description} 
                id={id}
                due_date={due_date === null ? null : new Date(due_date)}
                completed={completed}
                label={label}
                handleDelete={handleDeleteTask}
                handleMark={handleMarkTask}
                handleUnmark={handleUnmarkTask}
                handleEdit={handleEditTask}/>)
    })
    
    const completedTasks = tasks.filter(({attributes}) => attributes.completed)
                                .map(({id, attributes}) => {
        const { name, description, due_date, completed, label } = attributes;
        return (<Task
                key={id}
                name={name} 
                description={description} 
                id={id}
                due_date={due_date === null ? null : new Date(due_date)}
                completed={completed}
                label={label}
                handleDelete={handleDeleteTask}
                handleMark={handleMarkTask}
                handleUnmark={handleUnmarkTask}
                handleEdit={handleEditTask}/>)
    })

    const editView = () => (
            <form onSubmit={handleSubmitRename}>
                <Box sx={{display:'flex', 
                    flexWrap:'nowrap', 
                    justifyContent:'space-between',
                    }}>
                    <TextField sx={{mt:1}}
                        onChange={handleChange} label="name" variant="standard"
                        name="name" value={editingName} ></TextField>
                    <Box sx={{display:'flex', alignItems:'bottom'}}>
                        <IconButton color="success" type="submit"><DoneIcon/></IconButton>
                        <IconButton color="error" onClick={()=>setEditMode(false)}><CloseIcon/></IconButton>
                    </Box>
                </Box>
            </form>
    )
    
    const defaultView = () => (
        <>
            <Box sx={{display:'flex', justifyContent:'space-between', flexWrap:'nowrap', position:'relative'}}  
                onMouseEnter={() => setShowButtons(true)} 
                onMouseLeave={() => setShowButtons(false)}>
                <Typography variant="h5" 
                    sx={{mt:4}} >
                    {listName}
                </Typography>
                <Fade in={showButtons}>
                    <Box sx={{mt:4, rowGap:0,  position: 'absolute', right:'0%'} }>
                        <Box sx={{display:'flex', alignItems:'center', gap:1}}>
                            <IconButton onClick={() => {setEditMode(true); setEditingName(listName)}} 
                                size='small' color='primary'>
                                <EditIcon/>
                            </IconButton>
                            <IconButton onClick={() => {setDeleteDialog(true)}} 
                                size='small' color='error'>
                                <DeleteOutlineIcon/>
                            </IconButton>
                            <IconButton onClick={() => setActiveAddTask(true)} 
                                size='small' color='success'>
                                <AddIcon/>
                            </IconButton> 
                        </Box>
                    </Box>
                </Fade>
            </Box>
            <TaskForm active={activeAddTask} handleSubmit={handleSubmit} setActiveAddTask={setActiveAddTask}/>
            <Dialog onClose ={()=>setDeleteDialog(false)} open={deleteDialog}>
                <DialogTitle>Are you sure you want to delete "{attributes.name}"?</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>{setDeleteDialog(false); handleDeleteList(id)}}>Delete</Button>
                    <Button onClick={()=>setDeleteDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )

    return (
        <Box className="todolist">
            { editMode ? editView() : defaultView() }
            <hr/>
            <Box height='30rem' sx={{
                overflow:'auto',
                visibility:'hidden',
                '&:hover': {
                    visibility: 'visible',
                }
            }}>
                <Box sx={{visibility:'visible'}}>
                    { incompleteTasks }
                    {completedTasks.length !== 0 && 
                    <Button onClick={()=>{setExpanded(!expanded)}}>
                        {expanded ? 'Hide' : 'Show'} Completed Tasks ({completedTasks.length}) {expanded ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                    </Button>}
                    <Collapse in={expanded} unmountOnExit>{ completedTasks }</Collapse>
                </Box>
            </Box>
        </Box>
    )
}

export default Todolist
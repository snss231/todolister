import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Task from './Task'
import TaskForm from './TaskForm' 
import { Dialog, DialogTitle, DialogActions, IconButton, Button, TextField, Box, Typography, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit';

const Todolist = ({ id, attributes, handleDeleteList, handleDeleteTask }) => {
    const [tasks, setTasks] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [listName, setListName] = useState(attributes.name)
    const [editingName, setEditingName] = useState()
    const [activeAddTask, setActiveAddTask] = useState(false)
    const [showButtons, setShowButtons] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)

    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    useEffect(() => {
        axios.get(`/api/v1/todolists/${id}`)
        .then(resp => {
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [tasks.length])

    useEffect(() => {
        setListName(listName)
    }, [listName])
    
    const handleSubmit = (e, task) => {
        e.preventDefault()
        
        const todolist_id = id

        axios.post('/api/v1/tasks', {task, todolist_id})
        .then(resp => {
            const updatedTasks = [ ...tasks, resp.data.data ]
            setTasks(updatedTasks)
        })
        .catch(resp => {}   )
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
                setEditMode(false); setListName(name);
             })
        
    }



    const taskList = tasks.map(({id, attributes}) => {
        return (<Task
                key={id}
                name={attributes.name} 
                description={attributes.description} 
                id={id}
                due_date={attributes.due_date === null ? null : new Date(attributes.due_date)}
                completed={attributes.completed}
                handleDelete={(id) => {handleDeleteTask(id); setTasks(tasks.filter(task => task.id !== id))}}/>)
        }
    )

    const editView = () => (
            <form onSubmit={handleSubmitRename}>
                <TextField sx={{mt:1}}
                    onChange={handleChange} label="name"
                    name="name" value={editingName} ></TextField>
                <br/>
                <Button type="submit">save</Button>
                <Button onClick={()=>setEditMode(false)}>cancel</Button>
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
                {showButtons &&
                <Box sx={{mt:4, rowGap:0,  position: 'absolute', right:'0%'} }>
                    <Paper sx={{display:'flex', alignItems:'center'}}>
                        <IconButton onClick={e => {setDeleteDialog(true)}} size='small'><DeleteOutlineIcon/></IconButton>
                        <IconButton onClick={() => {setEditMode(true); setEditingName(listName)}} size='small'><EditIcon/></IconButton>
                        <IconButton onClick={() => setActiveAddTask(true)} size='small'><AddIcon/></IconButton> 
                    </Paper>
                </Box> }
            </Box>
            <TaskForm active={activeAddTask} handleSubmit={handleSubmit} setActiveAddTask={setActiveAddTask}></TaskForm>
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
            <Box height='30em' 
            sx={{overflow:'hidden',
                pr:1,
                '&:hover': {
                    overflowY: 'auto',
                }
            }}>
                { taskList }
            </Box>
        </Box>
    )
}

export default Todolist
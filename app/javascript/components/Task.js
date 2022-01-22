import axios from 'axios'
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Card, TextField, Collapse, ButtonGroup, CardActions, Box, CardContent, Stack, Typography, IconButton, Dialog, DialogTitle, DialogActions, Button} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const formatDate = date => {
    const today = new Date()
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1)
    const thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7)


    const isToday = () => {
        return today.getDate() == date.getDate() && 
        today.getFullYear() == date.getFullYear() && 
        today.getMonth() == date.getMonth()
    }

    const isTomorrow = () => {
        return tomorrow.getDate() == date.getDate() && 
        tomorrow.getFullYear() == date.getFullYear() && 
        tomorrow.getMonth() == date.getMonth()
    }

    const isThisWeek = () => {
        return date >= today && date <= thisWeek
    }

    const isThisYear = () => {
        return date.getYear() === today.getYear()
    }

    if (isToday()) {
        return "Today"
    } else if (isTomorrow()) {
        return "Tomorrow"
    } else if (isThisWeek()) {
        return (new Intl.DateTimeFormat('en-US', { weekday: 'short'}).format(date)).toString()
    } else if (isThisYear()) {
        return (new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short'}).format(date)).toString()
    } else {
        return (new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year:'numeric'}).format(date)).toString()
    }
}

const Task = ({ name, description, id ,due_date, completed, handleDelete, handleMark, handleUnmark, 
    handleEdit }) => {

    const [editMode, setEditMode] = useState(false);
    const [task, setTask] = useState({ name, description, due_date, completed })
    const [editingTask, setEditingTask] = useState({})
    const [showButtons, setShowButtons] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false);

    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    

    const handleSubmit = e => {
        e.preventDefault();

        handleEdit(editingTask, id)
        setTask({...editingTask})
        setEditMode(false)
    }

    const markCompleted = () => {
        const complete = { completed: true }
        const completedTask = {...task, ...complete}
        handleMark(completedTask, id)
        setTask(completedTask)
    }

    const unmarkCompleted = () => {
        const incomplete = { completed: false }
        const incompleteTask = {...task, ...incomplete}
        handleUnmark(incompleteTask, id)
        setTask(incompleteTask)
    }

    const handleChange = e => {
        setEditingTask(Object.assign({}, editingTask, {[e.target.name]: e.target.value}))
    }

    const handleDate = date => {
        console.log(date)
        setEditingTask(Object.assign({}, editingTask, {due_date: date}))
    }


    const defaultView = () => (
        <Card onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
            elevation={4}>
            <CardContent>
                <Typography variant="h5">
                    {task.name}
                </Typography>
                <Typography variant="body2">
                    {task.description}
                </Typography>
                
                { task.due_date !== null && 
                <Box sx={{display:'flex', alignItems:'center', pt:2}}>
                    <CalendarTodayIcon/>
                    <Typography variant="body2" sx={{pl:1}}>
                        {formatDate(task.due_date)}
                    </Typography>
                </Box>}   
            </CardContent>

            <Collapse in={showButtons}>
                <CardActions>
                    <IconButton onClick={() => {setEditMode(true); setEditingTask({...task});}} 
                        color="primary" 
                        size="medium"><EditIcon/></IconButton>
                    <IconButton onClick={() => {setDeleteDialog(true)}} 
                        color="error" 
                        size="medium"><DeleteOutlineIcon/></IconButton>
                    <IconButton onClick={() => markCompleted()} 
                        size="medium"
                        color="success"><DoneIcon/></IconButton>
                </CardActions> 
            </Collapse>
            <Dialog onClose ={()=>setDeleteDialog(false)} open={deleteDialog}>
                <DialogTitle>Are you sure you want to delete "{name}"?</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>{setDeleteDialog(false); handleDelete(id)}}>Delete</Button>
                    <Button onClick={()=>setDeleteDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Card>)

    const editView = () =>  (   
        <Card>
            <Box component="form" onSubmit ={handleSubmit} margin='normal'>
                <Stack>
                    <TextField sx={{m:2, mb:0}}
                        onChange={handleChange}
                        variant="standard"
                        label="name"
                        name="name" 
                        value={editingTask.name} 
                        placeholder="My new task"/> 
                    <TextField sx={{m:2}}
                        label="description" 
                        onChange={handleChange} 
                        variant="standard"
                        name="description" 
                        value={editingTask.description} 
                        placeholder="description"
                        multiline={true}/>
                    <Box sx={{m:1}}>
                        <DatePicker
                            selected={editingTask.due_date}
                            onChange={handleDate} />
                    </Box>
                </Stack>
                <ButtonGroup sx={{m:1}}>
                    <IconButton type="submit" color="primary"><SaveIcon/></IconButton>
                    <IconButton onClick={() => {setEditMode(false);}} color="error"><CancelIcon/></IconButton>
                </ButtonGroup>
            </Box>
        </Card>
    )

    const completedView = () => (
        <Card onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
            elevation={6}>
            <CardContent>
                <Typography variant="h5" sx={{color:"LightGrey"}}>
                    <strike>{name}</strike>
                </Typography>
                <Typography variant="body2" sx={{color:"LightGrey"}}>
                    <strike>{description}</strike>
                </Typography>
            </CardContent>
            { showButtons &&
            <CardActions>
                <Button onClick={()=>unmarkCompleted()}>unmark task completed</Button>
                <Button onClick={()=>unmarkCompleted()}>delete</Button>
            </CardActions>
            }  
            <Dialog onClose ={()=>setDeleteDialog(false)} open={deleteDialog}>
                <DialogTitle>Are you sure you want to delete "{name}"?</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>{setDeleteDialog(false); handleDelete(id)}}>Delete</Button>
                    <Button onClick={()=>setDeleteDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Card>)


    return (
        <Box sx={{m:1}}>
             {completed ? completedView() : editMode ? editView() : defaultView()}
        </Box>
    
    )
}



export default Task
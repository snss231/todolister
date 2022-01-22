import axios from 'axios'
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Card, TextField, CardHeader, ButtonGroup, CardActions, Box, CardContent, Stack, Typography, IconButton, Dialog, DialogTitle, DialogActions, Button} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';


const Task = ({ name, description, id, handleDelete, due_date, completed, handleMark, handleUnmark, 
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

        // axios.patch(`/api/v1/tasks/${id}`, {task, id})
        // .then(resp => {
        //     setEditMode(false)
        // })
        // .catch()
    }

    const markCompleted = () => {
        const complete = { completed: true }
        const completedTask = {...task, ...complete}
        handleMark(completedTask, id)
    }

    const unmarkCompleted = () => {
        const incomplete = { completed: false }
        const incompleteTask = {...task, ...incomplete}
        handleUnmark(incomplete, id)
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
            elevation={6}>
            <CardContent>
                <Typography variant="h5">
                    {task.name}
                </Typography>
                <Typography variant="body2">
                    {task.description}
                </Typography>
                <Typography variant="body2">
                    {task.due_date !== null && 'due: ' + task.due_date.toDateString()}
                </Typography>
            </CardContent>
            { showButtons &&
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
            }  
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
                    <TextField sx={{m: 1}}
                        onChange={handleChange}
                        label="name"
                        name="name" 
                        value={editingTask.name} 
                        placeholder="My new task"/> 
                    <TextField sx={{m:1}}
                        label="description" 
                        onChange={handleChange} 
                        name="description" 
                        value={editingTask.description} 
                        placeholder="description"
                        multiline={true}/>
                    <DatePicker
                        selected={editingTask.due_date}
                        onChange={handleDate} />
                </Stack>
                <ButtonGroup>
                    <IconButton type="submit"><SaveIcon/></IconButton>
                    <IconButton onClick={() => {setEditMode(false);}}><CancelIcon/></IconButton>
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
                <Typography variant="body2">
                    {task.due_date !== null && 'due: ' + task.due_date.toDateString()}
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
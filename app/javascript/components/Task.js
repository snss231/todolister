import axios from 'axios'
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Card, TextField, CardHeader, ButtonGroup, CardActions, Box, CardContent, Stack, Typography, IconButton} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';


const Task = ({ name, description, id, handleDelete, due_date, completed }) => {

    const [editMode, setEditMode] = useState(false);
    const [task, setTask] = useState({ name, description, due_date, completed })
    const [editingTask, setEditingTask] = useState({})
    const [showButtons, setShowButtons] = useState(false)

    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    useEffect(() => {
        setTask(task)}
    , [task])

    const handleSubmit = e => {
        e.preventDefault();

        setTask({...editingTask})

        axios.patch(`/api/v1/tasks/${id}`, {task, id})
        .then(resp => {
            setEditMode(false)
        })
        .catch()
    }

    const handleChange = e => {
        setEditingTask(Object.assign({}, editingTask, {[e.target.name]: e.target.value}))
    }

    const handleDate = date => {
        console.log(date)
        setEditingTask(Object.assign({}, editingTask, {due_date: date}))
    }
    
    const markCompleted = () => {
        const completedTask = Object.assign({}, task, {completed: true})

        axios.patch(`/api/v1/tasks/${id}`, {task: completedTask, id})
        .then(resp => {
            setTask(completedTask)
        })
        .catch()
    }


    const defaultView = () => (
        <Card onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}>
            <CardHeader 
                title={task.name}
                subheader={task.description}
            />
            <CardContent>
                <Typography variant="body2">
                    {task.due_date !== null && 'due: ' + task.due_date.toDateString()}
                </Typography>
                {task.completed && <div>completed!</div>}
            </CardContent>
            { showButtons &&
            <CardActions>
                <IconButton onClick={() => {setEditMode(true); setEditingTask({...task});}} 
                    color="primary" 
                    size="medium"><EditIcon/></IconButton>
                <IconButton onClick={(e) => handleDelete(e, id)} 
                    color="error" 
                    size="medium"><DeleteOutlineIcon/></IconButton>
                <IconButton onClick={() => markCompleted()} 
                    size="medium"
                    color="success"><DoneIcon/></IconButton>
            </CardActions>
            }  
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


    return editMode ? editView() : defaultView();
}



export default Task
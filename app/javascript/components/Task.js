import axios from 'axios'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Card, TextField, CardHeader, Button, CardActions, Box, CardContent, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';


const Task = ({ name, description, id, handleDelete, due_date }) => {

    const [editMode, setEditMode] = useState(false);
    const [task, setTask] = useState({ name, description, due_date }) 
    const [showButtons, setShowButtons] = useState(false)

    const handleSubmit = e => {
        e.preventDefault();

        const csrfToken = document.querySelector('[name=csrf-token]').content
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

        axios.patch(`/api/v1/tasks/${id}`, {task, id})
        .then(resp => {
            setEditMode(false)
        })
        .catch()
    }

    const handleChange = e => {
        setTask(Object.assign({}, task, {[e.target.name]: e.target.value}))
        //console.log('task: ', task)
    }

    const handleDate = date => {
        console.log(date)
        setTask(Object.assign({}, task, {due_date: date}))
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
            </CardContent>
            { showButtons &&
            <CardActions>
                <Button onClick={() => setEditMode(true)} 
                    color="primary" 
                    variant="contained" 
                    size="small"><EditIcon/></Button>
                <Button onClick={(e) => handleDelete(e, id)} 
                    color="error" 
                    variant="contained" 
                    size="small"><DeleteOutlineIcon/></Button>
                <Button variant="contained" 
                    size="small"
                    color="success"><DoneIcon></DoneIcon></Button>
            </CardActions>
            }  
        </Card>)

    const editView = () =>  (
        <Card>
            <Box component="form" onSubmit ={handleSubmit} margin='normal'>
                <Stack spacing={2}>
                    <TextField sx={{mt: 1}}
                        onChange={handleChange}
                        label="name"
                        name="name" 
                        value={task.name} 
                        placeholder="My new task"/> 
                    <TextField
                        label="description" 
                        onChange={handleChange} 
                        name="description" 
                        value={task.description} 
                        placeholder="description"
                        multiline={true}/>
                    <DatePicker 
                        selected={task.due_date}
                        onChange={handleDate} />
                </Stack>
                <CardActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={() => setEditMode(false)}>Cancel</Button>
                </CardActions>

            </Box>
        </Card>
    )


    return editMode ? editView() : defaultView();
}



export default Task
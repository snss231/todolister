import axios from 'axios'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, TextField, CardHeader, Button, ButtonGroup, IconButton, CardActions} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';


const Task = ({ name, description, id, handleDelete }) => {

    const [editMode, setEditMode] = useState(false);
    const [task, setTask] = useState({ name, description })

    const handleSubmit = e => {
        e.preventDefault();

        const csrfToken = document.querySelector('[name=csrf-token]').content
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        console.log(task)

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



    const defaultView = () => (
        <Card>
            <CardHeader 
                title={task.name}
                subheader={task.description}
            />
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
        </Card>)

    const editView = () =>  (
        <Card>
            <form onSubmit ={handleSubmit}>
                <TextField
                    onChange={handleChange}
                    name="name" 
                    value={task.name} 
                    placeholder="My new task">
                </TextField><br/>
                <TextField 
                    onChange={handleChange} 
                    name="description" 
                    value={task.description} 
                    placeholder="description">
                </TextField>
                <Button type="submit">Save</Button>
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
            </form>
        </Card>
    )


    return editMode ? editView() : defaultView();
}



export default Task
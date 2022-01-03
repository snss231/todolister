import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Task from './Task'
import TaskForm from './TaskForm' 
import { Grid, Card, CardHeader, Button } from '@mui/material'

const Todolist = ({ id, attributes }) => {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        axios.get(`/api/v1/todolists/${id}`)
        .then(resp => {
            setTasks(resp.data.included)
        })
        .catch(resp => console.log(resp))
    }, [tasks.length])

    
    const handleSubmit = (e, task) => {
        e.preventDefault();

        const csrfToken = document.querySelector('[name=csrf-token]').content
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

        const todolist_id = id

        axios.post('/api/v1/tasks', {task, todolist_id})
        .then(resp => {
            const updatedTasks = [ ...tasks, resp.data.data ]
            setTasks(updatedTasks)
        })
        .catch(resp => {}   )
    }

    const handleDelete = (e, taskId) => {
        e.preventDefault();
        console.log(taskId)
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id === taskId))
        })
    }

    const taskList = tasks.map(task => 
            <Task 
                name={task.attributes.name} 
                description={task.attributes.description} 
                id={task.id}
                handleDelete={handleDelete}>
            </Task> 
    )

    return (
        <Grid item><Card>
            <CardHeader title={attributes.name}></CardHeader>
            <TaskForm handleSubmit={handleSubmit}></TaskForm>
                { taskList }
        </Card></Grid>
    )
}


export default Todolist
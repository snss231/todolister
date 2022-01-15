import React, { useState } from 'react'
import {Button, TextField, Card, ButtonGroup, Stack, IconButton} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TaskForm = ({handleSubmit, active, setActiveAddTask}) => {
    const [task, setTask] = useState({name: '', description: ''})

    const handleChange = e => {
        e.preventDefault();

        setTask(Object.assign({}, task, {[e.target.name]: e.target.value}))
        console.log('task: ', task)
    }

    const activeView = () => (
        <Card>
            <form onSubmit ={e => {handleSubmit(e, task); setActiveAddTask(false); setTask({name: '', description: ''})}}>
                <Stack>
                    <TextField sx={{m:2}}
                        onChange={handleChange} label="name"
                        name="name" value={task.name} 
                        placeholder="My new task">
                    </TextField>
                    <TextField sx={{m:2}}
                        label="description"
                        onChange={handleChange} name="description" value={task.description} 
                        placeholder="description">
                    </TextField>
                </Stack>
                <ButtonGroup sx={{m:2}}>
                    <IconButton type="submit"><SaveIcon/></IconButton>
                    <IconButton onClick={() => {setActiveAddTask(false); setTask({name: '', description: ''})}}><CancelIcon/></IconButton>
                </ButtonGroup>
            </form>
        </Card>
    )
    

    return active && activeView()
        
}

export default TaskForm
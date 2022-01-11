import React, { useState } from 'react'
import {Button, TextField, Card, ButtonGroup, CardActions, Stack} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TaskForm = ({handleSubmit}) => {
    const [task, setTask] = useState({name: '', description: ''})
    const [active, setActive] = useState(false);

    const handleChange = e => {
        e.preventDefault();

        setTask(Object.assign({}, task, {[e.target.name]: e.target.value}))
        console.log('task: ', task)
    }

    const activeView = () => (
        <Card>
            <form onSubmit ={e => {handleSubmit(e, task); setTask({name: '', description: ''})}}>
                <Stack spacing={2}>
                    <TextField sx={{mt:1}}
                        onChange={handleChange} label="name"
                        name="name" value={task.name} 
                        placeholder="My new task">
                    </TextField>
                    <TextField
                        label="description"
                        onChange={handleChange} name="description" value={task.description} 
                        placeholder="description">
                    </TextField>
                </Stack>
                <ButtonGroup>
                    <Button type="submit"><SaveIcon/></Button>
                    <Button onClick={() => {setActive(false); setTask({name: '', description: ''})}}><CancelIcon/></Button>
                </ButtonGroup>
            </form>
        </Card>
    )
    
    const inactiveView = () => ( 
        <CardActions><Button onClick={() => setActive(true)}>add new task</Button></CardActions>
    )

    return active ? activeView() : inactiveView() 
        
}

export default TaskForm
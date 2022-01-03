import React, { useState } from 'react'
import {Button, TextField, Card, ButtonGroup, CardActions} from '@mui/material'
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
                <TextField
                    onChange={handleChange} 
                    name="name" value={task.name} 
                    placeholder="My new task">
                </TextField><br/>
                <TextField
                    onChange={handleChange} name="description" value={task.description} 
                    placeholder="description">
                </TextField><br/>
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
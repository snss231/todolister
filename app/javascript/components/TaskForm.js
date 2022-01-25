import React, { useState } from 'react'
import {TextField, Card, ButtonGroup, Stack, IconButton, Typography, Box, Button} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DatePicker from 'react-datepicker';

const TaskForm = ({handleSubmit, active, setActiveAddTask}) => {
    const [task, setTask] = useState({name: '', description: '', due_date: null})
    const [addDate, setAddDate] = useState(false)

    const handleChange = e => {
        e.preventDefault();

        setTask(Object.assign({}, task, {[e.target.name]: e.target.value}))
        console.log('task: ', task)
    }

    const handleDate = date => {
        setTask(Object.assign({}, task, {due_date: date}));
    };

    const activeView = () => (
        <Card>
            <Typography variant='h6' sx={{ml: 2, mt: 2}}>Add new task:</Typography>
            <form onSubmit ={e => {handleSubmit(e, task); setActiveAddTask(false); setTask({name: '', description: ''})}}>
                <Stack>
                    <TextField sx={{m:2}} inputProps={{required:'required'}}
                        onChange={handleChange} label="name"
                        name="name" value={task.name} 
                        placeholder="My new task">
                    </TextField>
                    <TextField sx={{m:2}}
                        label="description"
                        onChange={handleChange} name="description" value={task.description} 
                        placeholder="description">
                    </TextField>
                    {!addDate && <Box sx={{ml:1}}>
                        <Button onClick={()=>setAddDate(true)}>+ Add date</Button>
                    </Box>}
                    {addDate && <Box sx={{m:1, ml:2}}>
                        <DatePicker
                            selected={task.due_date}
                            onChange={handleDate} />
                    </Box>}
                </Stack>
                <ButtonGroup sx={{m:2}}>
                    <IconButton color='primary' type="submit"><SaveIcon/></IconButton>
                    <IconButton color='error' onClick={() => {setActiveAddTask(false); setTask({name: '', description: ''})}}><CancelIcon/></IconButton>
                </ButtonGroup>
            </form>
        </Card>
    )
    return active && activeView()       
}

export default TaskForm
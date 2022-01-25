import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import TaskForm from './TaskForm' ;
import { Dialog, DialogTitle, DialogActions, IconButton, Button, TextField, Box, Typography, Collapse, Fade} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

 
const Todolist = ({ id, attributes, handleDeleteList, onUpdateTask, onDeleteTask, onCreateTask }) => {
    const [tasks, setTasks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [listName, setListName] = useState(attributes.name);
    const [editingName, setEditingName] = useState();
    const [activeAddTask, setActiveAddTask] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    useEffect(() => {
        axios.get(`/api/v1/todolists/${id}`)
        .then(resp => {
            setTasks(resp.data.included);
        })
        .catch(resp => console.log(resp))
    }, []);
    

    const handleChange = e => {
        e.preventDefault();
        setEditingName(e.target.value);
    };

    const handleSubmitRename = e => {
        e.preventDefault();
        const todolist = { name: editingName }
        axios.patch(`/api/v1/todolists/${id}`, { todolist })
        .then(resp => {
            setEditMode(false);
            setListName(editingName);
        });
    };

    const handleCreateTask = (e, task) => {
        e.preventDefault();
        
        const todolist_id = id;
        axios.post('/api/v1/tasks', {task, todolist_id})
        .then(resp => {
            const updatedTasks = [ ...tasks, resp.data.data ];
            setTasks(updatedTasks);
            onCreateTask(resp.data.data)
        });
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`/api/v1/tasks/${taskId}`)
        .then(resp => {
            setTasks(tasks.filter(task => task.id !== taskId));
            onDeleteTask(taskId);
        })
    };

    const handleUpdateTask = (task, taskId) => {
        axios.patch(`/api/v1/tasks/${taskId}`, {task, taskId})
        .then(resp => {
            setTasks([...tasks.filter(t => t.id !== taskId), {attributes: task, id: taskId}]);
            onUpdateTask(task, taskId);
        });
    };


    const incompleteTasks = tasks.filter(({attributes}) => !attributes.completed)
                                  .map(({id, attributes}) => {
        return (<Task
                key={id}
                id={id}
                attributes={attributes}
                handleDelete={handleDeleteTask}
                handleUpdate={handleUpdateTask}/>);
    });
    
    const completedTasks = tasks.filter(({attributes}) => attributes.completed)
                                .map(({id, attributes}) => {
        return (<Task
                key={id}
                id={id}
                attributes={attributes}
                handleDelete={handleDeleteTask}
                handleUpdate={handleUpdateTask}/>);
    });

    const editView = () => (
            <form onSubmit={handleSubmitRename}>
                <Box sx={{display:'flex', 
                    flexWrap:'nowrap', 
                    justifyContent:'space-between',
                    }}>
                    <TextField sx={{mt:1}}
                        onChange={handleChange} label="name" variant="standard" inputProps={{required:'required'}}
                        name="name" value={editingName} ></TextField>
                    <Box sx={{display:'flex', alignItems:'bottom'}}>
                        <IconButton color="success" type="submit"><DoneIcon/></IconButton>
                        <IconButton color="error" onClick={()=>setEditMode(false)}><CloseIcon/></IconButton>
                    </Box>
                </Box>
            </form>
    );
    
    const defaultView = () => (
        <>
            <Box sx={{display:'flex', justifyContent:'space-between', flexWrap:'nowrap', position:'relative'}}  
                onMouseEnter={() => setShowButtons(true)} 
                onMouseLeave={() => setShowButtons(false)}>
                <Typography variant="h5" 
                    sx={{mt:4}} >
                    {listName}
                </Typography>
                <Fade in={showButtons}>
                    <Box sx={{mt:4, rowGap:0,  position: 'absolute', right:'0%'} }>
                        <Box sx={{display:'flex', alignItems:'center', gap:1}}>
                            <IconButton onClick={() => {setEditMode(true); setEditingName(listName)}} 
                                size='small' color='primary'>
                                <EditIcon/>
                            </IconButton>
                            <IconButton onClick={() => {setDeleteDialog(true)}} 
                                size='small' color='error'>
                                <DeleteOutlineIcon/>
                            </IconButton>
                            <IconButton onClick={() => setActiveAddTask(true)} 
                                size='small' color='success'>
                                <AddIcon/>
                            </IconButton> 
                        </Box>
                    </Box>
                </Fade>
            </Box>
            <TaskForm active={activeAddTask} handleSubmit={handleCreateTask} setActiveAddTask={setActiveAddTask}/>
            <Dialog onClose ={()=>setDeleteDialog(false)} open={deleteDialog}>
                <DialogTitle>Are you sure you want to delete "{attributes.name}"?</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>{setDeleteDialog(false); handleDeleteList(id)}}>Delete</Button>
                    <Button onClick={()=>setDeleteDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );

    return (
        <Box className="todolist">
            { editMode ? editView() : defaultView() }
            <hr/>
            <Box height='30rem' sx={{
                overflow:'auto',
                visibility:'hidden',
                '&:hover': {
                    visibility: 'visible',
                }
            }}>
                <Box sx={{visibility:'visible'}}>
                    { incompleteTasks }
                    {completedTasks.length !== 0 && 
                    <Button onClick={()=>{setExpanded(!expanded)}}>
                        {expanded ? 'Hide' : 'Show'} Completed Tasks ({completedTasks.length}) {expanded ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                    </Button>}
                    <Collapse in={expanded} unmountOnExit>{ completedTasks }</Collapse>
                </Box>
            </Box>
        </Box>
    );
};

export default Todolist
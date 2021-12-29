import axios from 'axios'
import React, { useState } from 'react'
import { Button, ButtonGroup, Card } from 'react-bootstrap'

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
            <Card.Title>{task.name}</Card.Title>
            <Card.Subtitle>{task.description}</Card.Subtitle>
            <ButtonGroup>
                <Button onClick={() => setEditMode(true)} variant="secondary" size="sm">edit</Button>
                <Button onClick={(e) => handleDelete(e, id)} variant="secondary" size="sm" >delete</Button>
                <Button variant="secondary" size="sm">mark completed</Button>
            </ButtonGroup>
        </Card>)

    const editView = () =>  (
        <div className="wrapper">
            <form onSubmit ={handleSubmit}>
                <div className="field">
                    <input onChange={handleChange} type="text" name="name" value={task.name} placeholder="My new task"/>
                </div>
                <div className="field">
                    <input onChange={handleChange} type="text" name="description" value={task.description} placeholder="description"/>
                </div>
                <button type="submit">Save</button><button onClick={() => setEditMode(false)}>Cancel</button>
            </form>
        </div>
    )


    return editMode ? editView() : defaultView();
}



export default Task
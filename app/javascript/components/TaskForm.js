import React, { useState } from 'react'

const TaskForm = ({handleSubmit}) => {
    const [task, setTask] = useState({name: '', description: ''})

    const handleChange = e => {
        e.preventDefault();

        setTask(Object.assign({}, task, {[e.target.name]: e.target.value}))
        console.log('task: ', task)
    }

    return (
        <div className="wrapper">
            <form onSubmit ={e => {handleSubmit(e, task); setTask({name: '', description: ''})}}>
                <div className="field">
                    <input onChange={handleChange} type="text" name="name" value={task.name} placeholder="My new task"/>
                </div>
                <div className="field">
                    <input onChange={handleChange} type="text" name="description" value={task.description} placeholder="description"/>
                </div>
                <button type="submit">+</button>
            </form>
        </div>
    )
}

export default TaskForm
import React from 'react'

const Todolist = (props) => {
    return (
        <div className="card">
            <div className="name">
                {props.attributes.name}
            </div>
            <div className="description">
                {props.attributes.description}
            </div>
        </div>
    )
}

export default Todolist
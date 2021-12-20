import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from '../Todolist/Todolist'

const Todolists = () => {
    const [todolists, setTodolists] = useState([])

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])


    const list = todolists.map( item => {
        return (<Todolist key={item.attributes.name} attributes={item.attributes}/>)
    })

    return (
        <div className="home">
            <div className="header">
                <h1>Todolister</h1>
                <div className="subheader">To do or not to do?</div>
            </div>
            <div className="lists">
                {list}
            </div>
        </div>

    )
}

export default Todolists
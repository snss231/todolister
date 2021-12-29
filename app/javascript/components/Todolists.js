import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Row } from 'react-bootstrap'

const Todolists = () => {
    const [todolists, setTodolists] = useState([])

    useEffect(() => {
        axios.get('/api/v1/todolists')
        .then(resp => {
            setTodolists(resp.data.data)
        })
        .catch(resp => console.log(resp))
    }, [todolists.length])


    const lists = todolists.map( item => {
        return (<Todolist key={item.id} id={item.id} attributes={item.attributes}/>)
    })

    return (
        <div className="App">
            <div className="header">
                <h1>Todolister</h1>
                <div className="subheader">To do or not to do?</div>
            <br/><br/>
            </div>
            <Row>{lists}</Row>
        </div>
    )
}

export default Todolists
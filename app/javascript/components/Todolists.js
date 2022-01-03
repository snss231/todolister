import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Todolist from './Todolist'
import { Grid } from '@mui/material'

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
        return (<Grid item xs={12} sm={6} md={4} lg={3} >
            <Todolist key={item.id} id={item.id} attributes={item.attributes}/>
            </Grid>)
    })

    return (
        <div className="App">
            <div className="header">
                <h1>Todolister</h1>
                <div className="subheader">To do or not to do?</div>
            <br/><br/>
            </div>
            <Grid container spacing={2}>{lists}</Grid>
        </div>
    )
}

export default Todolists
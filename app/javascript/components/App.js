import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Todolist from './Todolist/Todolist'
import Todolists from './Todolists/Todolists'

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Todolists}/>
            <Route exact path="/todolists/:id" component={Todolist}/>
        </Switch>
    )
}

export default App
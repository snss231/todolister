import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Todolist from './Todolist'
import Main from './Main'


const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/todolists/:id" component={Todolist}/>
        </Switch>
    )
}

export default App
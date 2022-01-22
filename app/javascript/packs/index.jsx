import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App'
import { BrowserRouter as Router, Route } from 'react-router-dom'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div')
  container.className = "main"
  ReactDOM.render(
    <Router>
      <Route path="/" component={App}/>
    </Router>,
    document.body.appendChild(container)
  )
}) 

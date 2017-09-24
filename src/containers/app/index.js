import React from 'react';
import { Route, Link } from 'react-router-dom'

import Home from '../home'
import About from '../about'
import SFMap from '../sfmap'

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="/about-us">About</Link>
    </header>

    <main>
      <div style={{width: 70 +'%', float: 'left', position: 'relative'}}>
        <SFMap />
      </div>
      <div style={{width: 30 +'%', float: 'left'}}>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
        <Route exact path="/route/:id" component={About} /> 
      </div>
    </main>
  </div>
)

export default App

import React from "react";
import { Route, Link, Switch } from "react-router-dom";

import Home from "../home";
import About from "../about";
import SFMap from "../sfmap";
import RouteView from "../routeview";
import NotFound from "../notfound";

import "../../styles/layout.css";

const App = () => (
  <main>
    <div className="mapview">
      <SFMap />
    </div>
    <div className="infoview">
      <header>
        <Link to="/">Home</Link>
        <Link to="/about-us">About</Link>
      </header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
        <Route exact path="/route/:id" component={RouteView} />
        <Route name="notfound" path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </main>
);

export default App;

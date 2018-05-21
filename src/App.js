import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import Dashboard from './dashboard/Dashboard'
import SmartMeterDashboard from './dashboard/SmartMeterDashboard'
import PowermonNav from './PowermonNav'
import MeterOverview from './meter/MeterOverview'

class App extends Component {
  constructor(props) {
   super(props);

   this.toggleNavbar = this.toggleNavbar.bind(this);
   this.state = {
     isOpen: false
   };
 }


  toggleNavbar() {
    this.setState({
       isOpen: !this.state.isOpen
     });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Powermon 2.0</h1>
          </header>

          <PowermonNav />

          <Route exact path="/" component={Dashboard} />
          <Route exact path="/smartmeter" component={SmartMeterDashboard} />
          <Route exact path="/meter" component={MeterOverview} />
        </div>
      </Router>
    );
  }
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// import AppNav from './AppNav';
import AppNavbar from './AppNavbar';
import Home from './pages/home/Home';
import Adb from './pages/adb/Adb';

const App = () => (
  <Router>
    <div className="app">
      <AppNavbar />
      <Route exact path="/" component={Home} />
      <Route path="/adb" component={Adb} />
      <Route path="/help" component={Adb} />
    </div>
  </Router>
);

export default App;

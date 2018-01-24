import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// import AppNav from './AppNav';
import AppNavbar from './AppNavbar';
import Home from './pages/home/Home';
import Generator from './pages/generator/Generator';
import Images from './pages/images/Images';
import Help from './pages/help/Help';

const App = () => (
  <Router>
    <div className="app">
      <AppNavbar />
      <Route exact path="/" component={Home} />
      <Route path="/adb" component={Generator} />
      <Route path="/images" component={Images} />
      <Route path="/help" component={Help} />
    </div>
  </Router>
);

export default App;

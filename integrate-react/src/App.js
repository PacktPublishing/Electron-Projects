import React, { Component } from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function Index() {
  return <h2>Home</h2>;
}

function Files() {
  return <h2>Files</h2>;
}

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar className="bp3-dark">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Blueprint</Navbar.Heading>
            <Navbar.Divider />
            <Link className="bp3-button bp3-minimal bp3-icon-home" to="/">
              Home
            </Link>
            <Link
              className="bp3-button bp3-minimal bp3-icon-document"
              to="/files/"
            >
              Files
            </Link>
          </Navbar.Group>
        </Navbar>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <Route path="/" exact component={Index} />
          <Route path="/files/" component={Files} />
        </header>
      </Router>
    );
  }
}

export default App;

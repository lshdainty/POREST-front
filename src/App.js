import React, { Component } from 'react';
import Nav from './components/Nav'
import './App.css';

class Subject extends Component {
  render() {
    return (
      <header>
        <h1>{this.props.title}</h1>
        {this.props.sub}
      </header>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Subject title="WEB" sub="world wide web!"></Subject>
        <Nav></Nav>
      </div>
    );
  }
}

export default App;

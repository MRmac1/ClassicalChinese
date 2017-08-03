"use strict";

import ReactDOM from 'react-dom';
import React from 'react';
import './home.css';
import SideBar from './container/SideBar';
import Promotion from './container/Promotion';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1
    };
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    let preIndex = this.state.index;
    this.setState({
      index: preIndex + 1
    });
  }
  render() {
    return (
      <div className="box">
        <SideBar activeIndex={this.state.index} onClick={this.handleClick}/>
        <Promotion activeIndex={this.state.index}/>
      </div>
    )
  }
}

ReactDOM.render( <HomePage />, document.querySelector('#root') );

"use strict";

import React from 'react';
import './sidebar.css'

class SideBar extends React.Component {
  constructor( props ){
    super(props);
    this.handleBarClick = this.handleBarClick.bind(this);
  }
  handleBarClick() {
    console.log( 'in handleBarClick' );
    this.props.onClick();
  }
  render() {
    return <div onClick={this.handleBarClick} className="sideBar">SideBar {this.props.activeIndex}</div>
  }
}

export default SideBar
import React, { Component } from 'react';

function styleItemSize(item, gridUnit) {
  return {
    width: item.w * gridUnit,
    height: item.h * gridUnit
  };
};  

class Item extends Component {

  render() {
    const item = this.props.item;
    const className = `grid-item ${this.props.size}`;
    // console.log(item, gridUnit);
    return (
      <div className={className}>
        <p>item {item.text}</p>
        <p>{item.w}x{item.h}</p>
      </div>
     );
  }
}




export default Item;

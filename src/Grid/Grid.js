import React, { Component } from 'react';
import './Grid.css';
import Item from '../Item/Item';


class Grid extends Component {

  minWidth = 150;
  oneWidth = this.minWidth; //default

  setWidth = () => {
    const containerWidth = document.getElementById('grid').offsetWidth - 18;
    const noOfOneColumns = containerWidth / this.minWidth;
    const oneWidth = Math.round(containerWidth / Math.floor(noOfOneColumns));
    console.log(oneWidth);
    this.oneWidth = oneWidth;
  };



  componentDidMount() {
    this.setWidth();
    console.log('oneWidth', this.oneWidth);
    const Packery = require('packery');
    const grid = document.getElementById('grid');
    const pckry = new Packery(grid, {
      itemSelector: '.grid-item',
      gutter: 0,
    });

    pckry.on('layoutComplete', (items) => {
      this.setWidth();

      console.log(this.oneWidth, 'layout complete');
      const gridItems = document.getElementsByClassName('gridItem');
      for (let i = 0; i < gridItems.length; i++) {
        const item = gridItems.item(i);
        console.log(i, item.className);
      }
    });

  }

  render() {

    const styles = () => {
      const oneWidth = this.oneWidth;
      const itemStyles = {
        gridItem: {},
        gridItem1x1: {
          width: `${oneWidth}px`,
          height: `${oneWidth}px`,
        },
        gridItem2x1: {
          width: `${2 * oneWidth}px`,
          height: `${oneWidth}px`,
        },
        gridItem1x2: {
          width: `${oneWidth}px`,
          height: `${2 * oneWidth}px`,
        },
        gridItem2x2: {
          width: `${2 * oneWidth}px`,
          height: `${2 * oneWidth}px`,
        },
      };

      return itemStyles;
    };

    const randomizeItems = (array, qtyItems) => {
      for (let i = 0; i < qtyItems; i++) {
        array.push({
          text: `${i}`,
          w: random(1, 2),
          h: random(1, 2),
        });
      }
      return array;
    };

    const random = (min, max) => {
      return min + Math.round(Math.random() * (max - min));
    }


    const randomItems = randomizeItems([], 100);
    return (

      <div id="grid">
        {randomItems.map((item, idx) => {
          const style = styles()[`gridItem${item.w}x${item.h}`];
          console.log('style', style);
          return (
            <div key={idx} className='gridItem' style={style} >
              <p>item {item.text}</p>
              <p>{item.w}x{item.h}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Grid;

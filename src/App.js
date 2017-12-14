import React, { Component } from 'react';
import './App.css';

class App extends Component {

  minWidth = 150;
  oneWidth;

  setWidth = () => {
    const containerWidth = document.getElementById('root').offsetWidth;
    const noOfOneColumns = containerWidth / this.minWidth;
    this.oneWidth = containerWidth / Math.floor(noOfOneColumns);
  };

  styles = () => {
    const oneWidth = this.oneWidth;
    const itemStyles = {
      gridItem: {},
      gridItem1x1: {
        width: `${oneWidth}px`,
        height: `${oneWidth}px`,
        background: 'lightblue'
      },
      gridItem2x1: {
        width: `${2 * oneWidth}px`,
        height: `${oneWidth}px`,
        background: 'lightpink'
      },
      gridItem1x2: {
        width: `${oneWidth}px`,
        height: `${2 * oneWidth}px`,
        background: 'lightgreen'
      },
      gridItem2x2: {
        width: `${2 * oneWidth}px`,
        height: `${2 * oneWidth}px`,
        background: 'lightyellow'
      },
    };

    return itemStyles;
  };

  resizeItems = () => {
    this.setWidth();
    const formats = ['gridItem1x1', 'gridItem2x2', 'gridItem1x2', 'gridItem2x1']
    formats.forEach(format => {
      const formatElements = document.getElementsByClassName(format);
      if (formatElements !== null) {
        for (const elem of formatElements) {
          elem.style.width = this.styles()[format].width;
          elem.style.height = this.styles()[format].height;
        }
      }
    });
  };


  componentDidMount() {
    const Packery = require('packery');
    const grid = document.getElementById('grid');
    const pckry = new Packery(grid, {
      itemSelector: '.gridItem',
      gutter: 0,
    });



    window.addEventListener('resize', this.resizeItems);

    /*
         pckry.on('layoutComplete', (items) => {
          this.setWidth();
          const formats = ['gridItem1x1', 'gridItem2x2', 'gridItem1x2', 'gridItem2x1']
          items.forEach(item => {
            const elem = item.element;
            formats.forEach(format => {
              if (elem.className.includes(format)) {
                elem.style.width = this.styles()[format].width;
                elem.style.height = this.styles()[format].height;
              }
            })
          });
        });
     */
  }


  render() {
    const random = (min, max) => {
      return min + Math.round(Math.random() * (max - min));
    }

    const randomizeItems = (array, qtyItems) => {
      for (let i = 0; i < qtyItems; i++) {
        array.push({
          text: `${i}`,
          w: random(1, 2),
          h: random(1, 2),
        });
      }
      return array;
    }

    const randomItems = randomizeItems([], 100);
    this.setWidth();

    return (
      <div className="App">
        <div id="grid" style={this.styles()['grid']} >
          {randomItems.map((item, idx) => {
            const style = this.styles()[`gridItem${item.w}x${item.h}`];
            const className = `gridItem gridItem${item.w}x${item.h}`
            return (
              <div key={idx} className={className} style={style} >
                <p>item {item.text}</p>
                <p>{item.w}x{item.h}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}




export default App;

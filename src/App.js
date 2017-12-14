import React, { Component } from 'react';
import './App.css';

class App extends Component {

  minWidth = 150;
  containerWidth;
  oneWidth;
  noOfOneColumns;
  pckry;

  setWidth = () => {
    let containerWidth = this.containerWidth = document.getElementById('grid').offsetWidth;
    this.noOfOneColumns = Math.floor(containerWidth / this.minWidth);
    this.oneWidth = Math.floor(containerWidth / this.noOfOneColumns);
    console.log('setWidth', containerWidth, this.noOfOneColumns, this.oneWidth);
  };

  styles = () => {
    const aspectRatio = 1 / 1;
    const baseOneWidth = this.oneWidth;
    const oneWidth = baseOneWidth * aspectRatio;
    const oneHeight = baseOneWidth;

    const itemStyles = {
      gridItem: {},
      gridItem1x1: {
        width: `${oneWidth}px`,
        height: `${oneHeight}px`,
        background: 'lightblue'
      },
      gridItem2x1: {
        width: `${2 * oneWidth}px`,
        height: `${oneHeight}px`,
        background: 'lightpink'
      },
      gridItem1x2: {
        width: `${oneWidth}px`,
        height: `${2 * oneHeight}px`,
        background: 'lightgreen'
      },
      gridItem2x2: {
        width: `${2 * oneWidth}px`,
        height: `${2 * oneHeight}px`,
        background: 'lightyellow'
      },
    };

    return itemStyles;
  };

  resizeItems = (event) => {
    let prevOneWidth = this.oneWidth;
    let prevNoOfOneColumns = this.prevNoOfOneColumns;
    let prevContainerWidth = this.containerWidth;
    const forceResize = event === true;
    this.setWidth();
    const bigChange = Math.abs(prevContainerWidth - this.containerWidth) >= 100;

    debounce(() => {
      const formats = ['gridItem1x1', 'gridItem2x2', 'gridItem1x2', 'gridItem2x1'];
      if (forceResize || prevOneWidth !== this.oneWidth || prevNoOfOneColumns !== this.noOfOneColumns) {
        formats.forEach(format => {
          const formatElements = document.getElementsByClassName(format);
          if (formatElements !== null) {
            for (const elem of formatElements) {
              elem.style.width = this.styles()[format].width;
              elem.style.height = this.styles()[format].height;
            }
          }
        });
        this.pckry.layout();
      }
    }, forceResize || bigChange ? 0 : 250)();
  };


  componentDidMount() {
    this.setWidth();
    this.resizeItems(true);
    const Packery = require('packery');
    const grid = document.getElementById('grid');
    this.pckry = new Packery(grid, {
      itemSelector: '.gridItem',
      // disable window resize behavior
      resize: false,
      stagger: 50,
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

    const randomItems = randomizeItems([], 24);

    return (
      <div className="App">
        <div id="grid" style={this.styles()['grid']} >
          {randomItems.map((item, idx) => {
            const style = this.styles()[`gridItem${item.w}x${item.h}`];
            const className = `gridItem gridItem${item.w}x${item.h}`;
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

// source: https://gist.github.com/nmsdvid/8807205
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {

  var timeout;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) {
        // console.log('apply');
        func.apply(context, args);
      }
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}



export default App;

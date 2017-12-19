import React, { Component } from 'react';
import './App.css';
import ItemsArray from './ItemsArray';

class App extends Component {

  minWidth = 150;
  containerWidth;
  oneWidth;
  noOfOneColumns;
  pckry;
  randomItems = new ItemsArray();

  constructor(props) {
    super(props);
    this.addItemButton = this.addItemButton.bind(this);
    this.addSticky = this.addSticky.bind(this);
  }

  setWidth = () => {
    let containerWidth = this.containerWidth = document.getElementById('grid').offsetWidth;
    this.noOfOneColumns = Math.floor(containerWidth / this.minWidth);
    this.oneWidth = containerWidth / this.noOfOneColumns;
    //console.log('setWidth', containerWidth, this.noOfOneColumns, this.oneWidth);
  };

  styles = () => {
    const aspectRatio = 1 / 1;
    const baseOneWidth = this.oneWidth;
    const oneWidth = baseOneWidth;
    const oneHeight = baseOneWidth / aspectRatio;

    const itemStyles = {
      gridItem: {},
      gridItem1x1: {
        width: `${oneWidth}px`,
        height: `${oneHeight}px`,
        background: '#235'
      },
      gridItem2x1: {
        width: `${2 * oneWidth}px`,
        height: `${oneHeight}px`,
        background: '#247'
      },
      gridItem1x2: {
        width: `${oneWidth}px`,
        height: `${2 * oneHeight}px`,
        background: '#458'
      },
      gridItem2x2: {
        width: `${2 * oneWidth}px`,
        height: `${2 * oneHeight}px`,
        background: '#125'
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
        for (const format of formats) {
          const formatElements = document.getElementsByClassName(format);
          if (formatElements !== null) {
            for (const elem of formatElements) {
              elem.style.width = this.styles()[format].width;
              elem.style.height = this.styles()[format].height;
            }
          }
        }


        this.pckry.layout();

      }
    }, forceResize || bigChange ? 0 : 250)();

    this.placeStickiesElements();

  };

  placeStickiesElements = () => {
    //place stickies
    for (const item of this.randomItems) {
      if (item.columnPercentage !== undefined) {
        this.placeSticky(item);
      }
    }
  };

  placeSticky = (item) => {
    const col = this.getStickyColumn(item.w, item.columnPercentage) - 1;
    const xCol = (col * this.oneWidth);
    const yRow = (item.row - 1) * this.oneWidth;
    // console.log('sticky', item.id, item.columnPercentage, '%', 'col', col, 'xcol:', xCol, 'row', item.row, 'yRow', yRow);
    const elem = document.getElementById(item.id);
    elem.style.position = 'absolute';
    elem.style.top = `${yRow}px`;
    elem.style.left = `${xCol}px`;
    this.pckry.stamp(elem);
  };

  getStickyColumn = (itemWidth, percentage) => {
    percentage = Math.max(percentage, 1);
    percentage = Math.min(percentage, 99);
    const baseCol = (Math.ceil((percentage) * this.noOfOneColumns / 100));
    return Math.min(baseCol, Math.min(baseCol + itemWidth, this.noOfOneColumns - (itemWidth - 1)));
  }

  /**
   * REACT METHODS
   */

  componentDidMount() {
    const Packery = require('packery');
    const grid = document.getElementById('grid');
    this.pckry = new Packery(grid, {
      itemSelector: '.gridItem',
      initLayout: false,
      // disable window resize behavior
      shiftResize: true,
      resize: true,
      gutter: 0,
    });
    this.resizeItems(true);

    window.addEventListener('resize', this.resizeItems);

    // show all items;
    this.pckry.once('layoutComplete', function (laidOutItems) {
      for (const item of laidOutItems) {
        const elem = item.element;
        elem.style.opacity = 1;
      }
    });

  }

  render() {
    let randomItems = this.randomizeItems(this.randomItems, 50);
    randomItems = this.randomizeStickyItems(randomItems, 3);
    this.randomItems = randomItems;
    return (
      <div className="App" >
        <header>
          <button onClick={this.addItemButton}>Add Item</button>
          <button onClick={this.addSticky}>Add Random Sticky</button>

          <hr />
        </header>
        <div id="grid" style={this.styles()['grid']} >
          {randomItems.map((item, idx) => {
            const style = this.styles()[`gridItem${item.w}x${item.h}`];
            //style.opacity = 0;
            const stickyColumn = item.columnPercentage ? this.getStickyColumn(item.w, item.columnPercentage) : null;
            const className = `gridItem${item.w}x${item.h} ${item.sticky ? 'sticky' : 'gridItem'} ${item.advert ? 'advert' : ''}`;

            return (
              <div id={idx} key={idx} className={className} style={style} >
                <p>item {item.text}</p>
                <p>{item.w}x{item.h}</p>
                {item.row ? <p>row: {item.row} column: {item.columnPercentage}% {stickyColumn}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }



  /**
   * 
   * DEBUG OR MOCK OR TEST METHODS
   * 
   */

  addItemButton() {
    this.addItem(this.randomizeItems([], 1)[0])
  }

  addItem(item) {
    const elem = this.insertItemOnGridDOM(item);
    this.pckry.prepended(elem);
  }

  addSticky(colPercent, row) {
    const item = this.randomizeStickyItems([], 1)[0];
    item.columnPercentage = this.random(0, 100);
    item.row = this.random(1, 5);
    this.insertItemOnGridDOM(item);
    this.placeSticky(item);
    this.pckry.layout();
  }

  addAdvert(toDom = true) {
    const advert = {
      id: this.randomItems.length,
      text: `ad${this.randomItems.length}`,
      w: this.random(1, 2),
      h: this.random(1, 2),
      advert: true
    };
    if (toDom) {
      this.addItem(advert);
    }
    return advert;
  }

  insertItemOnGridDOM(item) {
    item.id = this.randomItems.length;
    let itsTimeForAnAdvert = this.randomItems.push(item);
    if (itsTimeForAnAdvert) {
      this.addAdvert();
    }

    const elem = document.createElement('div');
    const style = this.styles()[`gridItem${item.w}x${item.h}`];
    const itemType = item.sticky ? 'sticky' : 'gridItem';
    const advert = item.advert ? 'advert' : '';
    const className = `${itemType} gridItem${item.w}x${item.h} ${advert}`;

    elem.style.width = style.width;
    elem.style.height = style.height;
    elem.style.background = style.background;

    elem.id = item.id;
    elem.className = className;
    elem.innerHTML = `
      <p>${itemType} ${item.id} ${advert}</p>
      <p>${item.w}x${item.h}</p>
      ${item.sticky ? `<p>col ${item.columnPercentage}% row ${item.row}</p>` : ''}
    `;

    const grid = document.getElementById('grid');
    const fragment = document.createDocumentFragment()
    fragment.appendChild(elem);
    grid.insertBefore(fragment, grid.firstChild);

    return elem;
  }

  random = (min, max) => {
    return min + Math.round(Math.random() * (max - min));
  }

  randomizeItems = (array, qtyItems) => {
    for (let i = 0; i < qtyItems; i++) {
      let itsTimeForAnAdvert = array.push({
        id: i,
        text: `${i}`,
        w: this.random(1, 2),
        h: this.random(1, 2),
      });
      if (itsTimeForAnAdvert) {
        array.push (this.addAdvert(false));
      }
    }
    return array;
  }

  randomizeStickyItems = (array, qtyItems) => {
    const start = array.length;

    for (let i = start; i < start + qtyItems; i++) {
      const columnPercentage = this.random(0, 100);
      const row = this.random(1, qtyItems*2);
      array.push({
        id: i,
        sticky: true,
        text: `sticky${i}`,
        w: this.random(1, 2),
        h: this.random(1, 2),
        columnPercentage,
        row
      });
    }
    return array;
  }

} // end of class



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
        func.apply(context, args);
      }
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}


export default App;

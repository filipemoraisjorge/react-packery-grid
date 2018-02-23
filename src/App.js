import React, { Component } from 'react';
import './App.css';

import Grid from './Grid/Grid';

import ItemsArray from './ItemsArray';

class App extends Component {

  minWidth = 150;
  aspectRatio = 1 / 1;
  containerWidth;
  oneWidth;
  noOfOneColumns;
  pckry;
  randomItems = new ItemsArray();

  constructor(props) {
    super(props);
    this.addItemButton = this.addItemButton.bind(this);
    this.fitStickyButton = this.fitStickyButton.bind(this);
  }

  addItem(item) {
    console.log('App item', item);
   this.grid.addItem(item);
   }


  /**
   * REACT METHODS
   */


  render() {
    let randomItems = this.randomizeItems(this.randomItems, 30 );
    randomItems = this.randomizeStickyItems(randomItems, 5);
    this.randomItems = randomItems;

    return (
      <div className="App" >
        <header>
          <button onClick={this.addItemButton}>Add Item</button>
          <button onClick={this.fitStickyButton}>Fit Sticky</button>
          <hr />
        </header>
        <Grid
          items={this.randomItems}
          minColumnWidth={150}
          aspectRatio={1 / 1}
          advertRate={10}
          onRef={ ref => (this.grid = ref)}
        />
      </div>
    );
  }



  /**
   * 
   * DEBUG OR MOCK OR TEST METHODS
   * 
   */
  addItemButton() {
    const item = this.randomizeItems(this.randomItems, 1)[this.randomItems.length-1]
    this.addItem(item);
  }

  fitStickyButton() {
    const item = this.randomizeItems([], 1)[0];
    item.stickyColumnPercentage = this.random(0, 100);
    item.row = this.random(1, 5);
    item.sticky = true;
    // TODO this 2 lines should be extracted to method fitItem(item), but this.insertItemOnGridDOM should refactor to findOrInsertOnDOM
    const elem = this.insertItemOnGridDOM(item);
    this.fitSticky(item, elem);
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
    const sticky = item.sticky ? 'sticky' : '';
    const className = `${itemType} gridItem${item.w}x${item.h} ${advert} ${sticky}`;

    elem.style.width = style.width;
    elem.style.height = style.height;
    elem.style.background = style.background;

    elem.id = item.id;
    elem.className = className;
    elem.innerHTML = `
      <p>${itemType} ${item.id} ${advert}</p>
      <p>${item.w}x${item.h}</p>
      ${item.sticky ? `<p>col ${item.stickyColumnPercentage}% row ${item.row}</p>` : ''} 
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
        id: array.length,
        text: '',
        w: this.random(1, 2),
        h: this.random(1, 2),
      });
      if (itsTimeForAnAdvert) {
        array.push(this.addAdvert(false));
      }
    }
    return array;
  }

  randomizeStickyItems = (array, qtyItems) => {
    const start = array.length;

    for (let i = start; i < start + qtyItems; i++) {
      const stickyColumnPercentage = this.random(0, 100);
      const row = this.random(1, qtyItems * 2);
      array.push({
        id: array.length,
        sticky: true,
        text: '',
        w: this.random(1, 2),
        h: this.random(1, 2),
        stickyColumnPercentage,
        row
      });
    }
    return array;
  }

} // end of class

export default App;

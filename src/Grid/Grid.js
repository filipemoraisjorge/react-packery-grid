import React, { Component } from 'react';
import './Grid.css';
import GridItem from './GridItem';

class Grid extends Component {

  pckry;

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items || [],
      sizes: {
        previous: {
          columnWidth: this.props.minColumnWidth,
          rowHeight: this.props.aspectRatio * this.props.minColumnWidth,
          containerWidth: null,
          numberOfColumns: null
        },
        current: {
          columnWidth: this.props.minColumnWidth,
          rowHeight: this.props.aspectRatio * this.props.minColumnWidth,
          containerWidth: null,
          numberOfColumns: null
        }
      },
      minColumnWidth: this.props.minColumnWidth,
      aspectRatio: this.props.aspectRatio || 1 / 1,
      advertRate: this.props.advertRate || Infinity,
    };
  }

  componentDidUpdate() {
    console.log('will update');
    if (this.pckry) {
      this.pckry.columnWidth = this.state.sizes.current.columnWidth;
      this.pckry.rowHeight = this.state.sizes.current.rowHeight;

      this.placeFitStickiesElements();

      // this.pckry.reloadItems();
      this.pckry.layout();
      console.log('componentDidUpdate', this.state.items[0], this.pckry.getItemElements());

    }
  }

  async componentDidMount() {
    await this.resizeItems(true);
    const Packery = require('packery');
    const grid = document.getElementById('grid');
    this.pckry = new Packery(grid, {
      itemSelector: '.gridItem',
      gutter: 0,
    });
    window.addEventListener('resize', this.resizeItems.bind(this));
    // component Event Handles bind.
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    return (
      <div id="grid" ref="child">
        {this.state.items.map((item, idx) => {
          return <GridItem key={item.id}
            item={item}
            columnWidth={this.state.sizes.current.columnWidth}
            rowHeight={this.state.sizes.current.rowHeight}
          />
        })}
      </div>
    )
  }


  async addItem(item) {
    const items = [...this.state.items];
    items.unshift(item);

    // layout changed, marked the stickies as not 'in place', they will be put 'in place' on componentWillUpdate 
    items.forEach((it) => { if (it.sticky) { return it.fitted = false } });

    await this.setState({ items }, () => {

    })
  };


  async setWidth() {
    const containerWidth = this.refs.child ? this.refs.child.parentNode.clientWidth : 0;// document.getElementById('grid').offsetWidth;
    const numberOfColumns = Math.floor(containerWidth / this.state.minColumnWidth);
    const columnWidth = containerWidth / numberOfColumns;
    const rowHeight = columnWidth / this.state.aspectRatio;

    await this.setState({
      sizes: {
        previous: this.state.sizes.current,
        current: { columnWidth, rowHeight, containerWidth, numberOfColumns }
      }
    });
  };

  async resizeItems(event) {
    await this.setWidth();
    const previous = this.state.sizes.previous;
    const current = this.state.sizes.current;

    const forceResize = event === true;
    const bigChange = Math.abs(previous.containerWidth
      - current.containerWidth) >= 100;
    debounce(() => {
      if (forceResize || previous.columnWidth !== current.columnWidth || previous.numberOfColumns !== current.numberOfColumns) {
        const mutatedItems = [...this.state.items];
        for (const item of mutatedItems) {
          item.columnWidth = current.columnWidth;
          item.rowHeight = current.rowHeight;
        }
        this.setState({ items: mutatedItems });
      }
    }, forceResize || bigChange ? 0 : 250)();
  }

  placeFitStickiesElements() {
    //const elements = document.getElementById('grid').childNodes;
    const elements = this.pckry.getItemElements();
    for (const elem of elements) {
      if (elem && elem.className.includes('sticky')) {
        const item = this.state.items.find(item => item.id === parseInt(elem.id, 10));
        if (!item.fitted) {
          this.fitSticky(item, elem);
        }
      }
    }
  }

  fitSticky(item, elem) {
    const col = this.getStickyColumn(item.w, item.stickyColumnPercentage) - 1;
    const xCol = (col * this.state.sizes.current.columnWidth);
    const yRow = (item.row - 1) * this.state.sizes.current.rowHeight;
    // if is not in pckry, add it
    const packeryElemIndex = this.pckry.getItemElements().findIndex(packeryElem => elem.id === packeryElem.id);
    if (packeryElemIndex === -1) {
      this.pckry.addItems(elem);
    }
    // if not in place, fit it in.
    if (!item.fitted) {
      item.fitted = true;
      this.pckry.fit(elem, xCol, yRow);
    }
  };


  getStickyColumn(itemWidth, percentage) {
    percentage = Math.max(percentage, 1);
    percentage = Math.min(percentage, 99);
    const numberOfColumns = this.state.sizes.current.numberOfColumns;
    const baseCol = (Math.ceil((percentage) * numberOfColumns / 100));
    return Math.min(baseCol, Math.min(baseCol + itemWidth, numberOfColumns - (itemWidth - 1)));
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
        func.apply(context, args);
      }
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}



export default Grid;

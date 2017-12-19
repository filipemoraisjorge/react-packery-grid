class ItemsArray extends Array {

    push = (elements) => {
        super.push(elements);
        return this.length % 11 === 0;
    };

}

export default ItemsArray;

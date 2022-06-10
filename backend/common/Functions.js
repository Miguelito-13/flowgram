
function getElementIndex(arr, element){
    if(!arr || !element){
        return;
    }

    arr.forEach((v, index) => {
        if(v === element) {
            return index;
        }
    });

}

export {
    getElementIndex
};
let imgElement = new Image();
let dragElement = document.createElement('span');
let myData = {
  id: 123,
  tag: 'p',
  text: 'Just a paragraph',
  timestamp: 0,
  url: '',
};

document.addEventListener('DOMContentLoaded', () => {
  
  //required event listeners
  document.body.addEventListener('dragstart', handleDragStart); //for draggable
  document.body.addEventListener('drop', handleDrop); //for dropzone
  document.body.addEventListener('dragover', handleOver); //for dropzone
  document.body.addEventListener('click', handleClick); //for dropzone
  
  //optional but useful events
  // document.body.addEventListener('mousedown', handleCursorGrab);
  document.body.addEventListener('dragenter', handleEnter);
  document.body.addEventListener('dragleave', handleLeave);
  
  //set up draggable things (non-ios)
  imgElement.src = './img/dragon-3.jpg';
  document.querySelector('footer>p').appendChild(imgElement);
  dragElement.textContent = 'Wheeeee';
  dragElement.classList.add('wheeeee');
  document.querySelector('footer>p').appendChild(dragElement);
});

function handleDragStart(ev) {
  //user started to drag a draggable from the webpage
  let obj = ev.target;
  if (!obj.closest('.draggable')) return;
  if(obj.classList.contains('draggable')){
    obj = obj.firstElementChild;
  }
  // console.log('DRAGSTART');
  // ev.dataTransfer.setDragImage(dragElement, 50, 50);
  // ev.dataTransfer.setDragImage(imgElement, 50, 50);
  // ev.dataTransfer.setData('text/plain', ' No MORE DATA ');
  
  myData.tag = obj.tagName;
  myData.text = obj.textContent?obj.textContent:obj.alt?obj.alt:'';
  myData.url = obj.href?obj.href: obj.src? obj.src:'';
  myData.timestamp = Date.now();
  let data = JSON.stringify(myData);
  ev.dataTransfer.setData('application/json', data);
  obj.setAttribute('data-ts', myData.timestamp);
  
  let dataList = ev.dataTransfer.items;
  for(let i=0; i<ev.dataTransfer.items.length; i++){
    let item = ev.dataTransfer.items[i];
    // console.log(i, item.kind, item.type);
  }
  
}
function handleDrop(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;

  ev.preventDefault();
  // console.log('DROP', dropzone);
  // let data = ev.dataTransfer.getData('text/plain');
  let data = JSON.parse(ev.dataTransfer.getData('application/json'));
  let draggable = document.querySelector(`[data-ts="${data.timestamp}"]`);
  let clone = draggable.cloneNode(true);
  dropzone.append(clone);
  // draggable.remove();
  
  // dropzone.textContent += data;
  dropzone.classList.remove('over');
  
  let len = ev.dataTransfer.items.length;
  for(let i = 0; i < len; i++){
    let item = ev.dataTransfer.items[i];
    if(item.kind === 'string' && item.type.match('^text/html')){
      //i got an html element
    }
    if(item.kind==='string' && item.type.match('^application/json')){
      //same as before... except the method getAsString
      item.getAsString((json)=>{
        let data = JSON.parse(json);
        // console.log('timestamp was', data.timestamp);
      })
    }
  }
  
  
}
function handleOver(ev) {
  //fires continually
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  // dropzone.classList.add('over'); //can do this in handleEnter
  // console.log('dragover dropzone');
}

//optional but useful visual stuff...
// function handleCursorGrab(ev) {
//   let obj = ev.target;
//   if (!obj.closest('.draggable')) return;
//   obj.style.cursor = 'grabbing'; //close the hand
// }
function handleEnter(ev) {
  //fires once
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  dropzone.classList.add('over');
  // console.log('dragenter dropzone')
}
function handleLeave(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  dropzone.classList.remove('over');
  // console.log('dragleave dropzone');
}
function handleClick(ev) { // FOR DELETING A SYMBOL
  if(document.querySelector("button.active")!=null){
    let dropzone = ev.target;
    if (!dropzone.classList.contains('dropzone')) return;
    ev.preventDefault();
    let symbol = dropzone.querySelector("div.dropzone > input");
    if(symbol!=null){ // FOR DELETING SYMBOLS EXCEPT START SYMBOL
      let dummy = dropzone.querySelector("div.dropzone > input#start");
      // console.log(dummy);
      if(dummy==null){
        symbol.remove();
      }
    } else { // FOR DELETING DECISION SYMBOL
      let symbol = dropzone.querySelector("div.dropzone > div.decision-box > input");
      symbol.remove();
      let symbol1 = dropzone.querySelector("div.dropzone > div.decision-box");
      symbol1.remove();
      // console.log(symbol);
    }
    
  }

  
  // console.log('DROP', dropzone);
}

function deleteSymbol(){ // TO INITIATE DELETE
  // DELETE BUTTON MUST BE ACTIVE TO DELETE SYMBOL
  document.getElementById("delete")
  .addEventListener("click", function(){
    if(this.classList.contains("active")){
      this.classList.remove("active");
    } else this.classList.add("active");
  });

  // console.log(act);
  // symbol.remove();
}
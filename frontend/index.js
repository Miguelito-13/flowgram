let imgElement = new Image();
let dragElement = document.createElement('span');
let myData = {
  id: 123,
  tag: 'p',
  text: 'Just a paragraph',
  timestamp: 0,
  url: '',
};
let canvas = document.getElementById("canvas");
let zoomLevel = 1;
let x = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

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
  clone.classList.add("samp");
  clone.classList.add("active");
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
  if(document.querySelector("button#delete.active")!=null){
    let symbol = ev.target;
    if (!symbol.classList.contains('samp')) return;
    ev.preventDefault();
    symbol.remove();
    console.log(symbol);
  }
}

function arrowSymbol(){ // ARROW BUTTON FUNCTIONS
  let arrow = document.getElementById("arrow");
  arrow.classList.add("active");

  let del = document.getElementById("delete");
  if(del.classList.contains("active")){
    del.classList.remove("active");
  }

  let text = document.getElementById("text");
  if(text.classList.contains("active")){
    text.classList.remove("active");
  }

  document.querySelectorAll("div.card > input")
  .forEach(function(element){
    element.classList.add("active");
  });

  document.querySelectorAll("div.dropzone > input")
  .forEach(function(element){
    element.classList.add("active");
  });

  document.querySelectorAll("div.decision-box > input")
  .forEach(function(element){
    element.classList.add("active");
  });
}

function textSymbol(){ // TEXT BUTTON FUNCTIONS
  let arrow = document.getElementById("arrow");
  if(arrow.classList.contains("active")){
    arrow.classList.remove("active");
  }

  let text = document.getElementById("text");
  if(text.classList.contains("active")){
    text.classList.remove("active");
    arrow.classList.add("active");
  }else text.classList.add("active");

  let del = document.getElementById("delete");
  if(del.classList.contains("active")){
    del.classList.remove("active");
  } 

  document.querySelectorAll("div.dropzone > input")
  .forEach(function(element){
    if(element.classList.contains("active")){
      element.classList.remove("active");
    }else element.classList.add("active");
  });

  document.querySelectorAll("div.decision-box > input")
  .forEach(function(element){
    if(element.classList.contains("active")){
      element.classList.remove("active");
    }else element.classList.add("active");
  });
}

function deleteSymbol(){ // TO INITIATE DELETE
  
  let arrow = document.getElementById("arrow");
  if(arrow.classList.contains("active")){
    arrow.classList.remove("active");
  }

  let del = document.getElementById("delete");
  if(del.classList.contains("active")){
    del.classList.remove("active");
    arrow.classList.add("active");
  }else del.classList.add("active");

  let text = document.getElementById("text");
  if(text.classList.contains("active")){
    text.classList.remove("active");
  }

  document.querySelectorAll("div.card > input")
  .forEach(function(element){
    element.classList.add("active");
  });

  document.querySelectorAll("div.dropzone > input")
  .forEach(function(element){
    element.classList.add("active");
  });

  document.querySelectorAll("div.decision-box > input")
  .forEach(function(element){
    element.classList.add("active");
  });

}

for(i=0;i<26;i++){ // CREATE GRID WITH ID
  for(j=1;j<6;j++){
    let newElement = document.createElement('div');
    newElement.classList.add('dropzone');
    newElement.id = x[i] +'0'+ j;
    if(i == 0 && j == 3){
      newElement.innerHTML = '<input type="text" id="start" name="decision" value="START / END" data-ts="1655295083726">';
    }
    // newElement.innerHTML = '<p>'+x[i]+'0'+j+'</p>';
    canvas.appendChild(newElement);
  }
}

function zoomIn(){ // ZOOM IN CANVAS
  if(zoomLevel < 2){
    zoomLevel += 0.1;
    canvas.style.zoom = `${zoomLevel}`;
  }
}

function zoomOut(){ // ZOOM OUT CANVAS
  if(zoomLevel > 0.7){
    zoomLevel -= 0.1;
    canvas.style.zoom = `${zoomLevel}`;
  }
}
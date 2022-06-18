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
let output = document.getElementById("output");
let zoom = document.getElementById("zoom");


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

//Gets triggered as soon as the user starts dragging
function handleDragStart(ev) {
  //user started to drag a draggable from the webpage
  let obj = ev.target;
  let arrow = document.getElementById("arrow");
  if (!obj.closest('.draggable') || !arrow.classList.contains("active")) return;
  console.log("Check")
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

//Gets triggered when the user lets go of the drag (left click)
function handleDrop(ev) {
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;

  ev.preventDefault();
  // console.log('DROP', dropzone);
  let data = JSON.parse(ev.dataTransfer.getData('application/json'));
  let draggable = document.querySelector(`[data-ts="${data.timestamp}"]`);
  let clone = draggable.cloneNode(true);
  clone.classList.add("samp");
  clone.classList.add("active");
  clone.classList.add("symbol-text");
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

//Gets triggered when the user hovers over an element (grid) Gets triggered continuously
function handleOver(ev) {
  //fires continually
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  // dropzone.classList.add('over'); //can do this in handleEnter
  // console.log('dragover dropzone');
}

//Gets triggered when the user's mouse enters an element
function handleEnter(ev) {
  //fires once
  let dropzone = ev.target;
  if (!dropzone.classList.contains('dropzone')) return;
  ev.preventDefault();
  dropzone.classList.add('over');
  // console.log('dragenter dropzone')
}

//Gets triggered when the user's mouse leaves an element
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
  
  activateDeactivateArrow(true)
  activateDeactivateText(false);

  let del = document.getElementById("delete");
  if(del.classList.contains("active")){
    del.classList.remove("active");
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
  
  activateDeactivateArrow(false)

  let text = document.getElementById("text");
  if(text.classList.contains("active")){
    activateDeactivateText(false);
    activateDeactivateArrow(true)
  }else activateDeactivateText(true);

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

  activateDeactivateArrow(false)
  activateDeactivateText(false)

  let del = document.getElementById("delete");
  if(del.classList.contains("active")){
    del.classList.remove("active");
    arrow.classList.add("active");
  }else del.classList.add("active");

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

function zoomIn(){ // ZOOM IN CANVAS
  if(zoomLevel < 2){
    zoomLevel += 0.1;
    canvas.style.zoom = `${zoomLevel}`;
  }
  let zoomScale = canvas.style.zoom * 100;
  zoom.innerHTML =  zoomScale.toFixed(0) + "%";

  // console.log(zoomScale);
}

function zoomOut(){ // ZOOM OUT CANVAS
  if(zoomLevel > 0.6){
    zoomLevel -= 0.1;
    canvas.style.zoom = `${zoomLevel}`;
  }
  let zoomScale = canvas.style.zoom * 100;
  zoom.innerHTML =  zoomScale.toFixed(0) + "%";

  // console.log(zoomScale);
}

function sampConsole(event) { // DISPLAY OUTPUT ON INPUT WINDOW
  event.preventDefault();
  var data = document.getElementById("data");
  let newElement = document.createElement('p');
  newElement.classList.add('success');
  newElement.innerHTML = data.value;
  output.appendChild(newElement);

  // console.log(newElement);
}

//Activate/Deactivate arrow function
function activateDeactivateArrow(activate){

  let arrow = document.getElementById("arrow");
  let draggables = document.getElementsByClassName("draggable");
  if(!draggables) return;
  if(arrow.classList.contains("active") && !activate){                           //Deactivate Arrow
    arrow.classList.remove("active");
    for(let i = 0; i < draggables.length; i++){
      draggables.item(i).setAttribute("draggable", false)
    }
    
  } else if (activate) {                                                          //Activate Arrow
    arrow.classList.add("active");
    for(let i = 0; i < draggables.length; i++){
      draggables.item(i).setAttribute("draggable", true)
    }
  }
}

//Activate/Deactivate text function
function activateDeactivateText(activate){

  let text = document.getElementById("text");
  let inputs = document.getElementsByClassName("symbol-text");
  if(!inputs) return;
  if(text.classList.contains("active") && !activate){                           //Deactivate Text
    text.classList.remove("active");
    for(let i = 0; i < inputs.length; i++){
      inputs.item(i).disabled = true;
      console.log(inputs.item(i), inputs.item(i).getAttribute("disabled"))
    }
    
  } else if (activate) {                                                          //Activate Text
    text.classList.add("active");
    for(let i = 0; i < inputs.length; i++){
      inputs.item(i).disabled = false;
      console.log(inputs.item(i), inputs.item(i).getAttribute("disabled"))
    }
  }
  console.log("Inputs:", inputs, inputs.item(0).getAttribute("disabled"))
}

for(i=0;i<26;i++){ // CREATE GRID WITH ID
  for(j=1;j<6;j++){
    let newElement = document.createElement('div');
    newElement.classList.add('dropzone');
    newElement.id = x[i] +'0'+ j;
    if(i == 0 && j == 3){
      newElement.innerHTML = '<input type="text" disabled id="start" name="decision" value="START" data-ts="1655295083726">';
    }
    // newElement.innerHTML = '<p>'+x[i]+'0'+j+'</p>';
    canvas.appendChild(newElement);
  }
}

// FOR DOWNLOADING FLOWCHART AS IMAGE
let save = document.getElementById("save");
save.addEventListener('click', () => {
  html2canvas(document.getElementById("canvas")).then(canvas => {
    save.href = canvas.toDataURL("image/jpeg", 0.9);
    save.download = "flowgram.jpg";
    // console.log(canvas.toDataURL("image/jpeg", 0.9));
  })
});

// FOR NEW FLOWGRAM
let newFlowgram = document.getElementById("new");
newFlowgram.addEventListener('click', () => {
  window.location.reload();
});

// RUN BUTTON FUNCTION
let runButton = document.getElementById("runButton");
runButton.addEventListener('click', () => {
  console.log("Run Button Pressed");
})

// STOP BUTTON FUNCTION
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener('click', () => {
  console.log("Stop Button Pressed");
})
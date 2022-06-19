
import startRunCompile, {createFlowgram} from '../backend/main.js';
import ConnectorSVGs from './connectorsvgs.js';


let flowgram = createFlowgram("New Flowgram");
let htmlSymbols = [];                   // {htmlSymbol: <html object>, backendSymbol: <symbol object>}
let htmlConnectors = [];                // [gridIDs]
let gridsInfo = {};                     // [gridID] = {type: "symbol"/"connector", index: arrayIndex}
let selectedGrids = [];

//=================================================//

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

//=================================================//                 Initialize Event listeners

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

//=================================================//                 EventListener Functions

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
  clone.classList.add("deletable");
  clone.classList.add("active");
  clone.classList.add("symbol");
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

//Gets triggered when the user clicks
function handleClick(ev) {
  // FOR DELETING A SYMBOL
  console.log(ev.target, ev.target.parentNode)
  if(document.querySelector("button#delete.active")!=null){
    let symbol = ev.target;
    if(symbol.parentNode.classList.contains('deletable')){
      symbol.remove();
    } 
    if(symbol.classList.contains('deletable')){
      symbol.remove();
    } else return;
    // console.log(symbol);
  }

  // CONNECTOR FUNCTION (SELECTING SYMBOL FIRST)
  if(document.querySelector("button#connectors.active")!=null){
    handleSelectPath(ev);
  }
}

//=================================================//       Initialize grid

for(let i=0;i<26;i++){ // CREATE GRID WITH ID
  for(let j=1;j<6;j++){
    let newElement = document.createElement('div');
    newElement.classList.add('dropzone');
    newElement.id = x[i] +'0'+ j;
    if(i == 0 && j == 3){
      newElement.innerHTML = '<input type="text" class="symbol" disabled id="start" name="decision" value="START" data-ts="1655295083726">';
    }
    // newElement.innerHTML = '<p>'+x[i]+'0'+j+'</p>';
    canvas.appendChild(newElement);
    htmlSymbols.push({
      htmlSymbol: newElement,
      backendSymbol: flowgram.main.start
    });

    gridsInfo[newElement.id] = {
      type: "symbol",
      index: htmlSymbols.length - 1
    }
  }
}

//=================================================//       Separated eventlisteners

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
  startRunCompile(flowgram);
})

// STOP BUTTON FUNCTION
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener('click', () => {
  console.log("Stop Button Pressed");
  flowgram.status.run = false;
})

// CONNECTOR BUTTON FUNCTION
let connectors = document.getElementById("connectors");
connectors.addEventListener('click', () => {
  let arrow = document.getElementById("arrow");
  if(connectors.classList.contains("active")){
    connectors.classList.remove("active");

    let selGrids = document.getElementsByClassName('selected-grid');
    console.log(selGrids, selGrids.length)
    while(selGrids.length > 0){
      selGrids.item(0).classList.remove('selected-grid');
    }
    selectedGrids = [];

    let confirm = document.getElementById("confirm");
    confirm.remove();
    let cancel = document.getElementById("cancel");
    cancel.remove();
  }else if(!connectors.classList.contains("active") && arrow.classList.contains("active")) {
    connectors.classList.add("active");

    // CREATE CONFIRM AND CANCEL BUTTON
    let navs = document.getElementById("navs-ul");
    let confirm = document.createElement("li");
    confirm.id = "confirm";
    confirm.innerHTML = '<button type="button" class="confirm" id="confirmBtn">Confirm</button>';
    navs.appendChild(confirm);

    let cancel = document.createElement("li");
    cancel.id = "cancel";
    cancel.innerHTML = '<button type="button" class="cancel" id="cancelBtn">Cancel</button>';
    navs.appendChild(cancel);

    // CONFIRM AND CANCEL BUTTON FUNCTIONS
    let confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener('click', () => {
    console.log("Confirm Button Pressed");

    let cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.addEventListener('click', () => {
    console.log("Cancel Button Pressed");

    let dropzone = document.querySelector(".dropzone");
    dropzone.addEventListener('click', () => {
      if(dropzone.querySelector("div.dropzone > input") != null){
        console.log(dropzone);
      }
    })
  })
})
  }
  // console.log(yes);
  // console.log("connector pressed");
})

//=================================================//

// FOR MODAL
let modal = document.getElementById("helpModal");
let helpBtn = document.getElementById("help");
let span = document.getElementsByClassName("close")[0];

// OPEN MODAL WHEN HELP BUTTON PRESSED
helpBtn.onclick = function(){
  modal.style.display = "block";
}

// CLOSE MODAL WHEN X BUTTON PRESSED
span.onclick = function(){
  modal.style.display = "none";
}

// CLOSE MODAL WHEN USER CLICKS OUTSIDE THE MODAL
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//=================================================//                   Separated functions

function handleSelectPath(ev){
  let grid
  if(ev.target.classList.contains('dropzone')){
    grid = ev.target
  } else if(ev.target.parentNode.classList.contains('dropzone')){
    grid = ev.target.parentNode
  } else if(ev.target.parentNode.classList.contains('symbol') || ev.target.parentNode.classList.contains('arrow')){
    grid = ev.target.parentNode.parentNode;
  }

  let childNode = grid.firstElementChild
  if(selectedGrids.length == 0 && childNode && childNode.classList.contains('symbol')){
    grid.classList.add('selected-grid');
    selectedGrids.push(grid.id);

  } else if(selectedGrids.length > 0){
    let lastID = selectedGrids[selectedGrids.length-1];
    let gridID = grid.id;

    
    if(grid.classList.contains('selected-grid') && grid.id == lastID){        // Deselecting last selected grid
      grid.classList.remove('selected-grid');
      selectedGrids.pop()
    } else if(grid.classList.contains('selected-grid')){
      return;
    }

    if((gridID.charCodeAt(0) == lastID.charCodeAt(0) + 1 && gridID.slice(1,3) == lastID.slice(1,3)) ||    //Grid below the last selected
      (gridID.charCodeAt(0) == lastID.charCodeAt(0) - 1 && gridID.slice(1,3) == lastID.slice(1,3))  ||    //Grid above the last selected
      (gridID.charAt(0) == lastID.charAt(0) && parseInt(gridID.slice(1,3)) == parseInt(lastID.slice(1,3)) + 1)  ||            //Grid to the right the last selected
      (gridID.charAt(0) == lastID.charAt(0) && parseInt(gridID.slice(1,3)) == parseInt(lastID.slice(1,3)) - 1)                //Grid to the left the last selected
    ){     
      grid.classList.add('selected-grid');
      selectedGrids.push(gridID);

      if(childNode != null){
        if(childNode.classList.contains('grid-connector')){
          let existingArray = htmlConnectors[gridsInfo[gridID].index];
          selectedGrids[selectedGrids.length - 1] = existingArray[existingArray.length - 1];
        }

        generateConnectors();
      }
    }
  }
}


function generateConnectors(){
  let pathCopy = [...selectedGrids];
  selectedGrids = [];

  if(connectors.classList.contains('active')){
    connectors.classList.remove('active');

    let confirm = document.getElementById('confirm');
    confirm.remove();
    let cancel = document.getElementById('cancel');
    cancel.remove();
  }

  for(let i = 1; i < pathCopy.length-1; i++){
    let from = "";
    let to = "";
    let arrow = "";

    if(pathCopy[i-1].charCodeAt(0) == pathCopy[i].charCodeAt(0) + 1 && pathCopy[i-1].slice(1,3) == pathCopy[i].slice(1,3)){
      from = "down";
    } else if(pathCopy[i-1].charCodeAt(0) == pathCopy[i].charCodeAt(0) - 1 && pathCopy[i-1].slice(1,3) == pathCopy[i].slice(1,3)){
      from = "up";
    } else if(pathCopy[i-1].charAt(0) == pathCopy[i].charAt(0) && parseInt(pathCopy[i-1].slice(1,3)) == parseInt(pathCopy[i].slice(1,3)) + 1){
      from = "right";
    } else if(pathCopy[i-1].charAt(0) == pathCopy[i].charAt(0) && parseInt(pathCopy[i-1].slice(1,3)) == parseInt(pathCopy[i].slice(1,3)) - 1){
      from = "left";
    }

    if(pathCopy[i+1].charCodeAt(0) == pathCopy[i].charCodeAt(0) + 1 && pathCopy[i+1].slice(1,3) == pathCopy[i].slice(1,3)){
      to = "down";
    } else if(pathCopy[i+1].charCodeAt(0) == pathCopy[i].charCodeAt(0) - 1 && pathCopy[i+1].slice(1,3) == pathCopy[i].slice(1,3)){
      to = "up";
    } else if(pathCopy[i+1].charAt(0) == pathCopy[i].charAt(0) && parseInt(pathCopy[i+1].slice(1,3)) == parseInt(pathCopy[i].slice(1,3)) + 1){
      to = "right";
    } else if(pathCopy[i+1].charAt(0) == pathCopy[i].charAt(0) && parseInt(pathCopy[i+1].slice(1,3)) == parseInt(pathCopy[i].slice(1,3)) - 1){
      to = "left";
    }

    if(i == pathCopy.length - 2){
      arrow = "arrow"
    }

    let grid = document.getElementById(pathCopy[i]);
    let newDiv = document.createElement('div')
    newDiv.classList.add('arrow')
    let newImg = document.createElement('img')
    newImg.classList.add('grid-connector')
    newImg.classList.add('connector-arrow')
    newImg.id = from + "-" + to
    newImg.setAttribute('src', ConnectorSVGs[from + "_" + to + (arrow != "" ? "_" + arrow: "")]);
    grid.appendChild(newDiv);
    newDiv.appendChild(newImg);


    let selGrids = document.getElementsByClassName('selected-grid');
    while(selGrids.length > 0){
      selGrids.item(0).classList.remove('selected-grid');
    }
    selectedGrids = [];

  }
}
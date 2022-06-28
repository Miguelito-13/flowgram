
import startRunCompile, {createFlowgram} from '../backend/main.js';
import ConditionalLogic from '../backend/run/symbol logic/ConditionalLogic.js';
import ConnectorSVGs from './connectorsvgs.js';


let flowgram = createFlowgram("New Flowgram");
let htmlSymbols = [];                   // {htmlSymbol: <html object>, backendSymbol: <symbol object>, connections: [htmlConnectorsIndex]}
let htmlConnectors = [];                // {path: [gridIDs], connections:[htmlConnectorsIndex] endSymbolGrid: htmlSymbolIndex}
let gridsInfo = {};                     // [gridID] = {type: "symbol"/"connector", index: arrayIndex}
let selectedGrids = [];
let connectorType = "none";
let conditionalConnectorInfo = {
  active: false,
  choice: null
}
let inputInfo

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
let x = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


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
  if (dropzone.classList.contains('dropzone') && dropzone.firstElementChild){
    dropzone.classList.remove('over');
    return;
  }

  ev.preventDefault();
  // console.log('DROP', dropzone);
  let data = JSON.parse(ev.dataTransfer.getData('application/json'));
  let draggable = document.querySelector(`[data-ts="${data.timestamp}"]`);
  let clone = draggable.cloneNode(true);
  clone.classList.add("deletable");
  clone.classList.add("active");
  clone.classList.add("symbol");
  if(clone.id=='decision-symbol'){
    clone.firstElementChild.classList.add("symbol-text");
  } else {
    clone.classList.add("symbol-text");
  }
  dropzone.append(clone);
  addSymbol(dropzone, clone);
  console.log(clone)
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
      initialDelete(symbol.parentNode.parentNode);
    } 
    if(symbol.classList.contains('deletable')){
      initialDelete(symbol.parentNode);
    } else return;
    // console.log(symbol);
  }

  // CONNECTOR FUNCTION (SELECTING SYMBOL FIRST)
  if(document.querySelector("button#connectors.active")!=null){
    handleSelectPath(ev);
  } else if(selectedGrids.length > 0){
    selectedGrids =[]
    connectorType ="none";
    conditionalConnectorInfo = {
      active: false,
      choice: null
    }
  }

}

//=================================================//       Initialize grid

for(let i=0;i<26;i++){ // CREATE GRID WITH ID
  for(let j=1;j<6;j++){
    let newElement = document.createElement('div');
    newElement.classList.add('dropzone');
    newElement.id = x[i] +'0'+ j;
    if(i == 0 && j == 3){
      newElement.innerHTML = '<input type="text" class="symbol" disabled id="start-end" name="decision" value="START" data-ts="1655295083726">';
      htmlSymbols.push({
        htmlSymbol: newElement,
        backendSymbol: flowgram.main.start,
        connections: []
      });
  
      gridsInfo[newElement.id] = {
        type: "symbol",
        index: htmlSymbols.length - 1
      }
    }
    // newElement.innerHTML = '<p>'+x[i]+'0'+j+'</p>';
    canvas.appendChild(newElement);
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
  if(flowgram.status.run == false){
    startRunCompile(flowgram);
    let errorGrids = document.getElementsByClassName('error-highlight');
    while(errorGrids.length > 0){
      errorGrids.item(0).classList.remove('error-highlight')
    }
  } else {
    displayOutput("ERROR: Flowgram is already running!", "error")
  }
})

// STOP BUTTON FUNCTION
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener('click', () => {
  console.log("Stop Button Pressed");
  flowgram.status.run = false;
  console.log("Flowgram STOP:", flowgram);
})

// CONNECTOR BUTTON FUNCTION
let connectors = document.getElementById("connectors");
connectors.addEventListener('click', () => {
  let arrow = document.getElementById("arrow");
  if(connectors.classList.contains("active")){
    connectors.classList.remove("active");

    deselectAll();
    
  }else if(!connectors.classList.contains("active") && arrow.classList.contains("active")) {
    connectors.classList.add("active");

    let dropzone = document.querySelector(".dropzone");
    dropzone.addEventListener('click', () => {
      if(dropzone.querySelector("div.dropzone > input") != null){
        console.log(dropzone);
      }
    })
  }
  // console.log(yes);
  // console.log("connector pressed");
})

let consoleInput = document.getElementById("data");
consoleInput.addEventListener('keypress', (e) => {
  console.log(e)
  if(e.key === "Enter"){
    if(typeof inputInfo == "object"){
      inputInfo.input = consoleInput.value
      inputInfo = null;
    }

    displayOutput(consoleInput.value, "text");
    consoleInput.value = "";
  }
})

let consoleSubmit = document.getElementById("submit-button");
consoleSubmit.addEventListener('click', (e) => {
  e.preventDefault()
  if(typeof inputInfo == "object"){
    inputInfo.input = consoleInput.value
    inputInfo = null;
  }

  displayOutput(consoleInput.value, "text");
  consoleInput.value = "";
})

//=================================================//

// FOR INSTRUCTIONS MODAL
let helpModal = document.getElementById("helpModal");
let helpBtn = document.getElementById("help");
let span = document.getElementsByClassName("close")[0];
let trueButton = document.getElementById('true');
let falseButton = document.getElementById('false');

// OPEN MODAL WHEN HELP BUTTON PRESSED
helpBtn.onclick = function(){
  helpModal.style.display = "block";
}

// CLOSE MODAL WHEN X BUTTON PRESSED
span.onclick = function(){
  helpModal.style.display = "none";
}

// CLOSE MODAL WHEN USER CLICKS OUTSIDE THE MODAL
window.onclick = function(event) {
  if (event.target == helpModal) {
    helpModal.style.display = "none";
  }
}

trueButton.onclick = function(){
  let conditionModal = document.getElementById("conditionModal");
  console.log(conditionalConnectorInfo)
  if(conditionalConnectorInfo.active){
    conditionalConnectorInfo.active = false;
    conditionalConnectorInfo.choice = "true";
    conditionModal.style.display = "none";
  }
}

falseButton.onclick = function(){
  let conditionModal = document.getElementById("conditionModal");
  if(conditionalConnectorInfo.active){
    conditionalConnectorInfo.active = false;
    conditionalConnectorInfo.choice = "false";
    conditionModal.style.display = "none";
  }
}

//=================================================//                   Separated functions

async function handleSelectPath(ev){
  let grid
  if(ev.target.classList.contains('dropzone')){
    grid = ev.target
  } else if(ev.target.parentNode.classList.contains('dropzone')){
    grid = ev.target.parentNode
  } else if(ev.target.parentNode.classList.contains('symbol') || ev.target.parentNode.classList.contains('arrow')){
    grid = ev.target.parentNode.parentNode;
  }

  if(!grid) return;
  let childNode = grid.firstElementChild
  if(selectedGrids.length == 0 && childNode && childNode.classList.contains('symbol')){
    let fromSymbol = htmlSymbols[gridsInfo[grid.id].index].backendSymbol

    if (fromSymbol.type == "Conditional"){
      //Show UI Modal true or false
      
      conditionalConnectorInfo.active = true;
      let conditionModal = document.getElementById("conditionModal");
      console.log(conditionModal)
      conditionModal.style.display = "block";

      while(conditionalConnectorInfo.active && conditionalConnectorInfo.choice == null){
        await new Promise(r => setTimeout(r, 500));
      }
      console.log("Info:", conditionalConnectorInfo)
      if(conditionalConnectorInfo.choice == null){
        console.error("ERROR: Didn't choose a connector type");
        return;
      }
      
      if(conditionalConnectorInfo.choice == "true" && fromSymbol.true){
        conditionalConnectorInfo.choice = null;
        displayOutput("ERROR: Conditional Symbol already has a true connector", "error");
        return;
      } else if(conditionalConnectorInfo.choice == "false" && fromSymbol.false){
        conditionalConnectorInfo.choice = null;
        displayOutput("ERROR: Conditional Symbol already has a false connector", "error");
        return;
      } 
      
      connectorType = conditionalConnectorInfo.choice;
      conditionalConnectorInfo.choice = null;
      grid.classList.add('selected-grid');
      selectedGrids.push(grid.id);

    } else if (fromSymbol.type != "Conditional"){
      
      if(fromSymbol.out){
        displayOutput("ERROR: Symbol already has a connector", "error");
        return;
      }
      grid.classList.add('selected-grid');
      selectedGrids.push(grid.id);

    } else {
      //Display Error
      return;
    }

  } else if(selectedGrids.length > 0){
    let lastID = selectedGrids[selectedGrids.length-1];
    let gridID = grid.id;

    console.log(gridsInfo[gridID], gridID)
    if(grid.classList.contains('selected-grid') && grid.id == lastID){        // Deselecting last selected grid
      if(selectedGrids.length == 1){
        connectorType = "none";
        conditionalConnectorInfo.choice = null
      }

      grid.classList.remove('selected-grid');
      selectedGrids.pop()
      return;
    } else if(grid.classList.contains('selected-grid')){
      displayOutput("Can only deselect the last grid selected.", "warning");
      return;
    } else if(selectedGrids.length == 1 && gridsInfo[gridID]){
      displayOutput("Second grid selected needs to be empty.", "warning");
      return;
    }

    if((gridID.charCodeAt(0) == lastID.charCodeAt(0) + 1 && gridID.slice(1,3) == lastID.slice(1,3)) ||    //Grid below the last selected
      (gridID.charCodeAt(0) == lastID.charCodeAt(0) - 1 && gridID.slice(1,3) == lastID.slice(1,3))  ||    //Grid above the last selected
      (gridID.charAt(0) == lastID.charAt(0) && parseInt(gridID.slice(1,3)) == parseInt(lastID.slice(1,3)) + 1)  ||            //Grid to the right the last selected
      (gridID.charAt(0) == lastID.charAt(0) && parseInt(gridID.slice(1,3)) == parseInt(lastID.slice(1,3)) - 1)                //Grid to the left the last selected
    ){     
      grid.classList.add('selected-grid');
      selectedGrids.push(gridID);

      if(childNode != null && grid.id != selectedGrids[0]){
        generateConnectors();
      } else if (childNode != null){
        displayOutput("ERROR: Symbol cannot be connected to itself.", "error");
        return;
      }
    }
  }
}

function generateConnectors(){
  let pathCopy = [...selectedGrids];
  selectedGrids = [];
  htmlConnectors.push({
    path: [...pathCopy],
    connections: []
  });
  let htmlConnectorIndex = htmlConnectors.length - 1

  if(connectors.classList.contains('active')){
    connectors.classList.remove('active');
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
    let newImg = document.createElement('img')
    newImg.classList.add('grid-connector')
    newImg.classList.add('connector-arrow')
    newImg.classList.add(from + "-" + to + (arrow != "" ? "-" + arrow: ""))
    newImg.setAttribute('src', ConnectorSVGs[from + "_" + to + (arrow != "" ? "_" + arrow: "")]);
    newDiv.classList.add('deletable')
    newDiv.classList.add('arrow')
    newDiv.appendChild(newImg);
    grid.appendChild(newDiv);

    if(connectorType != "none" && i == 1){
      let newP = document.createElement('p')
      newP.classList.add('arrow-text')
      newP.textContent = connectorType;
      newDiv.appendChild(newP);
    }

    grid.classList.remove('selected-grid');

    gridsInfo[pathCopy[i]] = {
      type: "connector",
      index: htmlConnectorIndex
    }
  }

  let done = false
  let pathTracked = pathCopy
  while(!done){                                                       // Sets htmlConnector's endSymbolGrid
    let gridInfoTracked = gridsInfo[pathTracked[pathTracked.length - 1]]
    if(gridInfoTracked.type == 'symbol'){
      htmlConnectors[htmlConnectorIndex].endSymbolGrid = pathTracked[pathTracked.length - 1];
      let endSymbol = htmlSymbols[gridInfoTracked.index];
      endSymbol.connections.push(htmlConnectorIndex);
      done = true;
    } else {
      pathTracked = htmlConnectors[gridInfoTracked.index].path;
    }
    
  }

  let info = gridsInfo[pathCopy[pathCopy.length - 1]]
  if(info.type == 'symbol'){
    htmlSymbols[info.index].connections.push(htmlConnectorIndex)
  } else {
    htmlConnectors[info.index].connections.push(htmlConnectorIndex)
  }
  htmlSymbols[gridsInfo[pathCopy[0]].index].connections.push(htmlConnectorIndex);

  let fromSymbol = htmlSymbols[gridsInfo[pathCopy[0]].index].backendSymbol
  let toSymbol = htmlSymbols[gridsInfo[htmlConnectors[htmlConnectorIndex].endSymbolGrid].index].backendSymbol
  if(fromSymbol.type != 'Conditional'){
    fromSymbol.out = toSymbol
  } else {
    if(connectorType == "true"){
      fromSymbol.true = toSymbol
    } else {
      fromSymbol.false = toSymbol
    }
    connectorType = "none"
  }
  
  console.log(fromSymbol);

  let selGrids = document.getElementsByClassName('selected-grid');
  while(selGrids.length > 0){
    selGrids.item(0).classList.remove('selected-grid');
  }

} 

function deselectAll(){
  selectedGrids = [];
  let gridsSelected = document.getElementsByClassName('selected-grid');
  while(gridsSelected.length > 0){
    gridsSelected.item(0).classList.remove('selected-grid');
  }
}

function initialDelete(grid){
  console.log(grid)
  let gridID = grid.id;
  let gridInfo = gridsInfo[gridID]

  console.log("gridInfo:", gridInfo);

  if(!gridInfo) return

  if(gridInfo.type == 'symbol'){
    let htmlSymbol = htmlSymbols[gridInfo.index]
    let connections = htmlSymbol.connections
    console.log("htmlSymbol:", htmlSymbol);
    for(let i = 0; i < connections.length; i++){
      deleteConnections(connections[i]);
    }

    if(grid && grid.firstChild){
      grid.firstChild.remove();
    }
    flowgram.removeSymbol(htmlSymbol.backendSymbol);
    htmlSymbols[gridInfo.index] = null;
    gridsInfo[gridID] = null;

  } else if(gridInfo.type == 'connector'){
    deleteConnections(gridInfo.index);
  }
}

function deleteConnections(index){
  let htmlConnector = htmlConnectors[index]
  console.log("htmlConnector:", htmlConnector);
  if(!htmlConnector) return;

  let connections = htmlConnector.connections
  for(let i = 0; i < connections.length; i++){
    deleteConnections(connections[i]);
  }

  let path = htmlConnector.path
  for(let i = 1; i < path.length - 1; i++){
    let grid = document.getElementById(path[i])
    if(grid && grid.firstChild){
      grid.firstChild.remove();
      gridsInfo[path[i]] = null;
    }
  }

  let startInfo = htmlSymbols[gridsInfo[htmlConnector.path[0]].index];
  let endInfo
  if(gridsInfo[htmlConnector.endSymbolGrid].type == 'symbol'){
    endInfo = htmlSymbols[gridsInfo[htmlConnector.endSymbolGrid].index]
  } else if(gridsInfo[htmlConnector.endSymbolGrid].type == 'connector'){
    endInfo = htmlConnectors[gridsInfo[htmlConnector.endSymbolGrid].index]
  }

  for(let i = 0; i < endInfo.connections.length; i++){
    if(endInfo.connections[i] == index){
      endInfo.connections.splice(i, 1);
    }
  }

  for(let i = 0; i < startInfo.connections.length; i++){
    if(startInfo.connections[i] == index){
      startInfo.connections.splice(i, 1);
    }
  }

  if(startInfo.backendSymbol.type != "Conditional"){
    if(startInfo.backendSymbol.out == endInfo.backendSymbol){
      startInfo.backendSymbol.out = null;
    }
  } else {
    if(startInfo.backendSymbol.true == endInfo.backendSymbol){
      startInfo.backendSymbol.true = null;
    }

    if(startInfo.backendSymbol.false == endInfo.backendSymbol){
      startInfo.backendSymbol.false = null;
    }

  }

  console.log(startInfo);
  console.log(endInfo);

  htmlConnectors[index] = null;
}

function addSymbol(dropzone, clone){
  let grid = dropzone.id;
  let cloneType = clone.id
  let type
  let text
  let inputHtml = clone
  
  if(cloneType == 'start-end'){
    type = 'StartEnd'
    text = 'START/END'
  } else if(cloneType == 'process'){
    type = 'Process'
    text = 'PROCESS'
  } else if(cloneType == 'decision-symbol'){
    type = 'Conditional'
    text = 'DECISION'
    inputHtml = clone.firstElementChild
  } else if(cloneType == 'input-output'){
    type = 'InputOutput'
    text = 'INPUT/OUTPUT'
  }

  let result = flowgram.addSymbol(type, text);
  if (result.error){
    console.log(result.error)
    //Display Error
    return;
  } else {

    htmlSymbols.push({
      htmlSymbol: clone,
      backendSymbol: result.newSymbol,
      connections: []
    })
  
    gridsInfo[grid] = {
      type: 'symbol',
      index: htmlSymbols.length-1
    }

    inputHtml.addEventListener('input', (ev) => {
      result.newSymbol.text = ev.target.value
    })
  }

  console.log(flowgram);
}

function getInput(inputObj){
  inputInfo = inputObj;
}

let output = document.getElementById("output"); // ID OF OUTPUT WINDOW
function displayOutput(text, outputType, symbol){
  console.log("Text: ", text, "type: ", outputType)
  let newElement = document.createElement('p');
  newElement.classList.add(outputType);
  newElement.textContent = text; // add text here
  output.appendChild(newElement); 
  output.scrollTo(0, output.scrollHeight);

  if(symbol && outputType == "error"){
    htmlSymbols.forEach((v) => {
      if(v.backendSymbol == symbol){
        let grid
        if(v.htmlSymbol.parentNode.classList.contains("dropzone")){
          grid = v.htmlSymbol.parentNode;
        } else if(v.htmlSymbol.parentNode.parentNode.classList.contains("dropzone")){
          grid = v.htmlSymbol.parentNode.parentNode;
        }

        if(grid){
          grid.classList.add("error-highlight")
        }
      }
    })
  }
}

//=================================================//                   Event Functions

export {
  displayOutput,
  getInput
};
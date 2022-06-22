let zoomLevel = 1;
let zoom = document.getElementById("zoom");
let output = document.getElementById("output");

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
}

// CHOSE TRUE IN CONDITION MODAL
function choseTrue(){
  chosen.value = "True";
  conditionModal.style.display = "none";
  console.log(chosen.value);
}

// CHOSE FALSE IN CONDITION MODAL
function choseFalse(){
  chosen.value = "False";
  conditionModal.style.display = "none";
  console.log(chosen.value);
}
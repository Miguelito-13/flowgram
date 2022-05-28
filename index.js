let display = document.getElementById('display');
// let shape = Array.from(document.getElementsByClassName('shapes'));

function Start() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute("class", "start-style")
    display.appendChild(x);
  }

// function Connector() {
//     var x = document.createElement("INPUT");
//     x.setAttribute("type", "text");
//     x.setAttribute("value", "");
//     x.setAttribute("class", "democlass")
//     display.appendChild(x);
//   }

function Input() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute("class", "input-style")
    display.appendChild(x);
  }

function Process() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute("class", "process-style")
    display.appendChild(x);
  } 

function Decision() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute("class", "decision-style")
    x.setAttribute("id", "border-style")
    display.appendChild(x);
  }






// shape.map( shapes =>{
//     shapes.addEventListener('click', (e) => {
//         switch(e.target.innerText){
//             default:
//                 let img = e.target;
//                 console.log(img);
//                 display.innerText += e.target.innerText;
//                 myFunction;
//         }
       
//     })
// })



// console.log('clicked');
//         console.log(e);
//         console.log(e.target);
//         console.log(e.target.innerText);
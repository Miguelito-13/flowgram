import startRunCompile, { createFlowgram } from './Main.js'

const form = document.getElementById('form');
const input = document.getElementById('code_input')

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Create Test Flowgram
    //console.log("Ran");
    const newFlowgramObj = createFlowgram("Test")
    let res = newFlowgramObj.addSymbol("Process")
    if(res.error){
        throw new Error(res.error);
    }
    newFlowgramObj.main.start.out = res.newSymbol;
    res.newSymbol.text = 'x = (1 + (1/1) + 2 * 3 + (100)) \n y = "true" z = false'
    let pastRes = res


    res = newFlowgramObj.addSymbol("InputOutput")
    if(res.error){
        throw new Error(res.error);
    }
    pastRes.newSymbol.out = res.newSymbol;
    res.newSymbol.text = 'INPUT x'
    pastRes = res

    let conditional
    res = newFlowgramObj.addSymbol("Conditional")
    if(res.error){
        throw new Error(res.error);
    }
    pastRes.newSymbol.out = res.newSymbol;
    res.newSymbol.text = '((x==x) AND (x == 1) AND 5 != 5) OR y == true'
    conditional = res


    res = newFlowgramObj.addSymbol("InputOutput")
    if(res.error){
        throw new Error(res.error);
    }
    conditional.newSymbol.true = res.newSymbol;
    res.newSymbol.text = 'OUTPUT x, " is equal to 1", y'
    pastRes = res


    res = newFlowgramObj.addSymbol("InputOutput")
    if(res.error){
        throw new Error(res.error);
    }
    conditional.newSymbol.false = res.newSymbol;
    res.newSymbol.text = 'OUTPUT x, " is not equal to 1", 5, true'
    let pastRes2 = res


    res = newFlowgramObj.addSymbol("StartEnd")
    if(res.error){
        throw new Error(res.error);
    }
    pastRes.newSymbol.out = res.newSymbol;
    pastRes2.newSymbol.out = res.newSymbol;
    res.newSymbol.text = "END"
    pastRes = res

    // ********************************************

    //console.log(newFlowgramObj)
    startRunCompile(newFlowgramObj);
});
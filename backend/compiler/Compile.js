import ConditionValidation from "./symbol validation/ConditionValidation.js";
import InputOutputValidation from "./symbol validation/InputOutputValidation.js";
import ProcessValidation from "./symbol validation/ProcessValidation.js";
import StartEndValidation from "./symbol validation/StartEndValidation.js";

const validTypes = [
    "StartEnd",
    "Process",
    "Conditional",
    "InputOutput"
]

export default async function Compile(symbol, root, flowgram){

    return new Promise(async (resolve, reject) => {

        if (!symbol){
            resolve()
            return;
        }


        //console.log("FLOWGRAM STATUS: ", flowgram.status.run)
        //console.log("FLOWGRAM STATUS2: ", flowgram.status)
        //console.log("FLOWGRAM STATUS3: ", flowgram)

        await new Promise(r => setTimeout(r, 50));             // Wait 250ms before proceeding

        if (symbol.checked){
            resolve();
            return;
        }

        if (!flowgram.status.run){
            //console.log("Compilation has been stopped or has ended");
            resolve()
            return;
        }
    
        if (root){
            symbol.root = root;
        }
    
        //console.log("============================");
        //console.log("Symbol Type:", symbol.type);
        //console.log("Symbol Text:", symbol.text);
        //console.log("Finite Automata Checked:")
        let result
        if (symbol.type === validTypes[0]){
            result = StartEndValidation(symbol, flowgram);
        } else if (symbol.type === validTypes[1]){
            result = ProcessValidation(symbol,flowgram);
        } else if (symbol.type === validTypes[2]){
            result = ConditionValidation(symbol, flowgram);
        } else if (symbol.type === validTypes[3]){
            result = InputOutputValidation(symbol, flowgram);
        } else {
            reject({symbol, error: "COMPILATION ERROR: Invalid Symbol"});
            return;
        }

        if (result.error){
            reject({symbol, error: result.error})
            return;
        }

        //console.log(flowgram);
        const res = getNextSymbols(result.symbol);
        if(res.error){
            reject({symbol, error: res.error});
            return;
        }

        for(let i = 0; i < res.connections.length; i++){
            try{
                await Compile(res.connections[i], root, flowgram);
            } catch ({symbol, error}){
                reject({symbol, error});
                return;
            }
        }

        resolve()

    })

}


function getNextSymbols(symbol){
    let res = {
        connections: [],
        error: false
    }

    if(symbol.type === "Conditional"){
        if(symbol.true && symbol.false){
            res.connections.push(symbol.true);
            res.connections.push(symbol.false);
        } else {
            res.error = "COMPILATION ERROR: Missing connection for conditional symbol";
        }
    } else if (symbol.type === "StartEnd" && symbol.tokenizedText[0].Token === "END"){
        if(symbol.out){
            res.error = "COMPILATION ERROR: Unexpected connection for end symbol";
        }
    } else{
        if (symbol.out){
            res.connections.push(symbol.out);
        } else {
            res.error = "COMPILATION ERROR: Missing connection for ", symbol.type, " symbol";
        }
    }

    return res;
}
import ConditionalLogic from "./symbol logic/ConditionalLogic.js";
import InputLogic from "./symbol logic/InputLogic.js";
import OutputLogic from "./symbol logic/OutputLogic.js";
import ProcessLogic from "./symbol logic/ProcessLogic.js";

export default async function Run(symbol, flowgram){

    return new Promise(async (resolve, reject) => {
        console.log("===============================")
        console.log(symbol)
        let result = {}

        await new Promise(r => setTimeout(r, 50));             // Wait 50ms before proceeding

        if(!flowgram.status.run){
            resolve()
            return;
        }

        if(symbol.type == "StartEnd"){
            const groupedTokens = [...symbol.groupedTokens.tokens]
            if(groupedTokens[0].Token == "START"){
                result.nextSymbol = symbol.out;
            } else {
                resolve();
                return;
            }

        } else if(symbol.type == "Process"){
            result = ProcessLogic(symbol, flowgram);

        } else if(symbol.type == "InputOutput"){
            const groupedTokens = [...symbol.groupedTokens.tokens]
            if(groupedTokens[0].Token == "INPUT"){
                result = await InputLogic(symbol, flowgram);
            } else {
                result = OutputLogic(symbol, flowgram);
            }

        } else if(symbol.type == "Conditional"){
            result = ConditionalLogic(symbol, flowgram);

        }
        console.log(flowgram);
        console.log(result);

        if (result.error){
            reject({symbol, error: result.error});
            return;
        }


        try{
            await Run(result.nextSymbol, flowgram);
        } catch({symbol, error}){
            reject({symbol, error});
            return;
        }
        
        resolve();

    })

}
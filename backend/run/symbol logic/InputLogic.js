import { getInput } from "../../../frontend/index.js";

export default function InputLogic(symbol, flowgram){
    
    return new Promise(async (resolve, reject) => {
        let res = {
            nextSymbol: symbol.out,
            error: false,
        }

        let cloneTokens = [...symbol.groupedTokens.tokens]

        if (cloneTokens[0].Token == "INPUT"){
            cloneTokens.shift();
        } else {
            res.error = true;
            return res;
        }

        if (cloneTokens[0].Type == "Identifier"){
            let status = {
                input: null
            }

            //status.input = "15"                                                 // Test Input
            getInput(status);                      
            while(status.input == null && flowgram.status.run){                 // Wait for user input
                await new Promise(r => setTimeout(r, 250));             // Wait 50ms
                console.log("Waiting for Input...")
            }             

            console.log("Input", status.input);
            let ret = flowgram.updateVariable(cloneTokens[0].Token, status.input, "Input")

        }

        resolve(res);
        return;
    })

    

}
export default function InputLogic(symbol, flowgram){
    
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

        status.input = "15"                                                 // Test Input
        // Call UI input function and pass status                           
        // while(status.input == null && flowgram.status.run){}             // Wait for user input

        let ret = flowgram.updateVariable(cloneTokens[0].Token, status.input, "Input")

    } else {
        res.error = true;
        return res;
    }

    
    return res;

}
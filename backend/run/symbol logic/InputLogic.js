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

    if (classTokens[0].Type == "Identifier"){
        let status = {
            input: null
        }

        // Call UI input function and pass status
        while(status.input == null && flowgram.status.run){}            // Wait for user input


    } else {
        res.error = true;
        return res;
    }

}
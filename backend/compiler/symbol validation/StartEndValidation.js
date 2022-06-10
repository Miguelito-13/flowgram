import StartEndFA from "../finite automata/StartEndFA.js"
import Tokenize from "../Tokenize.js";

export default function StartEndValidation(symbol, flowgram){
    let res = {
        symbol: symbol,
        error: false
    }

    if (symbol.checked){
        return res;
    }

    let tokenizedResult = Tokenize(symbol.text)
    if (tokenizedResult.error){
        res.error = tokenizedResult.error
        return res;
    }

    let response = StartEndFA(tokenizedResult.tokenized)
    if (response.error){
        res.error = response.error
        return res
    }

    
    
    if (tokenizedResult.tokenized[0].Token === "END"){
        if (!flowgram.main.start){
            res.error = "ERROR: Unexpected End without start symbol";
            return res;
        } else {
            flowgram.main.end = symbol;
        }
    }

    symbol.tokenizedText = tokenizedResult.tokenized;
    symbol.groupedTokens = response.groupedToken;
    symbol.checked = true;

    return res;
}
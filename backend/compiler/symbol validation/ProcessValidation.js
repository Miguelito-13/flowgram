
import AssignmentFA from "../finite automata/AssignmentFA.js";
import Tokenize from "../Tokenize.js";

export default function ProcessValidation(symbol, flowgram){

    let res = {
        symbol: symbol,
        error: false
    }

    if (symbol.checked){
        return res;
    }

    let tokenizedResult = Tokenize(symbol.text, true)
    if (tokenizedResult.error){
        res.error = tokenizedResult.error
        return res;
    }

    let response = AssignmentFA(tokenizedResult.tokenized, flowgram)
    if (response.error){
        res.error = response.error
        return res
    }

    symbol.tokenizedText = tokenizedResult.tokenized;
    symbol.groupedTokens = response.groupedToken;
    symbol.checked = true;

    return res;
}
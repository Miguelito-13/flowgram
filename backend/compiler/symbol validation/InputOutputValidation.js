import InputExpressionFA from "../finite automata/InputExpressionFA.js";
import OutputExpressionFA from "../finite automata/OutputExpressionFA.js";
import Tokenize from "../Tokenize.js";

export default function InputOutputValidation(symbol, flowgram){

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

    let response
    if(tokenizedResult.tokenized.length > 0 && tokenizedResult.tokenized[0].Token === "INPUT"){
        response = InputExpressionFA(tokenizedResult.tokenized, flowgram)
    } else {
        response = OutputExpressionFA(tokenizedResult.tokenized, flowgram)
    }

    if (response.error){
        res.error = response.error
        return res

    } else {
        symbol.tokenizedText = tokenizedResult.tokenized;
        symbol.groupedTokens = response.groupedToken;
        symbol.checked = true;
    }


    return res;
}
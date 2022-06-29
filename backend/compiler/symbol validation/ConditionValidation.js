import LogicalOpFA from "../finite automata/LogicalOpFA.js";
import RelationalOpFA from "../finite automata/RelationalOpFA.js";
import Tokenize from "../Tokenize.js";

export default function ConditionValidation(symbol, flowgram){

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


    let response1 = RelationalOpFA(tokenizedResult.tokenized, flowgram)
    let response2 = LogicalOpFA(tokenizedResult.tokenized, flowgram)
    if (response1.error){

        if (response2.error){
            res.error = "COMPILATION ERROR: Invalid Syntax for Conditional Symbol"
            return res
            
        } else {
            symbol.tokenizedText = tokenizedResult.tokenized;
            symbol.groupedTokens = response2.groupedToken;
            symbol.checked = true;
        }

    } else {
        symbol.tokenizedText = tokenizedResult.tokenized;
        symbol.groupedTokens = response1.groupedToken;
        symbol.checked = true;
    }

    //console.log(symbol)
    return res;
}
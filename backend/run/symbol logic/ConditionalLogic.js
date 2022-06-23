import LogicCalculator from "../logic functions/LogicCalculator.js";

export default function ConditionalLogic(symbol, flowgram){

    let res = {
        nextSymbol: null,
        error: false,
    }

    let conditionalOp = {...symbol.groupedTokens}

    if(conditionalOp){
        let result = LogicCalculator(conditionalOp, flowgram);
        if (result.error){
            res.error = result.error;
            return res;
        }

        console.log(result.result);
        res.nextSymbol = getNextSymbol(symbol, result.result.Token);
    }
    
    return res;

}


function getNextSymbol(symbol, result){
    if(result == true){
        return symbol.true
    } else if (result == false){
        return symbol.false
    }
}
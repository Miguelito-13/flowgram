import LogicCalculator from "../logic functions/LogicCalculator";

export default function ConditionalLogic(symbol, flowgram){

    let res = {
        nextSymbol: null,
        error: false,
    }

    let conditionalOp = [...symbol.groupedTokens.tokens]

    if(conditionalOp.length > 0){
        let result = LogicCalculator(conditionalOp, flowgram);
        if (result.error){
            res.error = result.error;
            return res;
        }

        res.nextSymbol = getNextSymbol(symbol, result.result);
        return res;
    }

}


function getNextSymbol(symbol, result){
    if(result == true){
        return symbol.true
    } else if (result == false){
        return symbol.false
    }
}
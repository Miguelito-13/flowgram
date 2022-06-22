import { NotifyText } from "../../common/Notify.js";
import Concatenator from "../logic functions/Concatenator.js";

export default function OutputLogic(symbol, flowgram){
    
    let res = {
        nextSymbol: symbol.out,
        error: false
    }
    let clonedTokens = [...symbol.groupedTokens.tokens]

    if(clonedTokens[0].Token == "OUTPUT"){
        clonedTokens.shift()
    }

    if(clonedTokens[0].groupedTokensType == "Concatenation Operation"){
        let ret = Concatenator(clonedTokens[0].tokens, flowgram);

        if (ret.error){
            res.error = ret.error;
            return res;
        }

        NotifyText(ret.result);
        console.log("OUTPUT ", ret.result)
    }

    return res;

}
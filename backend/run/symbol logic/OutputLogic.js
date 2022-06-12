import Concatenator from "../logic functions/Concatenator";

export default function OutputLogic(groupedTokens, flowgram){
    
    let res = {
        error: false
    }
    let clonedTokens = [...groupedTokens];

    if(clonedTokens[0].Token == "OUTPUT"){
        clonedTokens.shift()
    }

    if(clonedTokens[0].groupedTokensType == "Concatenation Operation"){
        let ret = Concatenator(clonedTokens[0].groupedTokens, flowgram);

        if (ret.error){
            res.error = ret.error;
            return res;
        }

        // Call UI function to display output
    }



}
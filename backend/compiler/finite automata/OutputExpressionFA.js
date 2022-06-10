import ConcatenationOpFA from "./ConcatenationOpFA.js"


export default function OutputExpressionFA(tokenizedText, flowgram){
    console.log("- OutputExpressionFA")

    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            groupedTokens: [],
        },
        error: false,
    }

    //=================================================
    if (tokenizedClone[0] && tokenizedClone[0].Token == "OUTPUT"){
        res.groupedToken.groupedTokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Output Expression"
        return res;
    }

    let result = ConcatenationOpFA(tokenizedClone, false);
    if(result.error){
        res.error = "ERROR: Invalid Syntax for Output Expression"
        return res;
    }

    res.groupedToken = {
        groupedTokens: tokenizedText,
        groupedTokensType: "Output Expression"
    };

    return res;
}
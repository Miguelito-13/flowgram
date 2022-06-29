

export default function InputExpressionFA(tokenizedText, flowgram){
    //console.log("- InputExpressionFA")
    
    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "Input Expression"
        },
        error: false,
    }

    //=================================================
    if (tokenizedClone[0] && tokenizedClone[0].Token == "INPUT"){
        res.groupedToken.tokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Input Expression"
        return res;
    }

    //=================================================
    if (tokenizedClone[0] && tokenizedClone[0].Type == "Identifier"){
        const existingVar = flowgram.getVariable(tokenizedClone[0].Token)
        if(!existingVar){
            res.error = "ERROR: Undefined variable '" + tokenizedClone[0].Token + "'"
            return res;
        } else {
            res.groupedToken.tokens.push(tokenizedClone[0])
            tokenizedClone.shift()
        }
    } else {
        res.error = "ERROR: Invalid Syntax for Input Expression"
        return res;
    }

    //=================================================
    if (tokenizedClone.length > 0){
        res.error = "ERROR: Invalid Syntax for Input Expression"
        return res;
    }
  

    return res;
}
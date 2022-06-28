const validFirstAndThirdToken = [
    "String Constant",
    "Boolean Constant",
    "Number Constant",
    "Identifier"
]

export default function RelationalOpFA(tokenizedText, flowgram){
    console.log("- RelationalOpFA")

    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "Relational Operation"
        },
        error: false,
    }

    //=================================================
    if (tokenizedClone[0] && validFirstAndThirdToken.includes(tokenizedClone[0].Type)){
        if(tokenizedClone[0].Type == "Identifier"){
            let existingVar = flowgram.getVariable(tokenizedClone[0].Token);
            if(!existingVar){
                res.error = "ERROR: Undefined variable '" + tokenizedClone[0].Token + "'.";
                return res;
            }
        }
        res.groupedToken.tokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Relational Operation"
        return res;
    }

    //=================================================
    if (tokenizedClone[0] && tokenizedClone[0].Type == "Relational Operator"){
        res.groupedToken.tokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Relational Operation"
        return res;
    }

    //=================================================
    if (tokenizedClone[0] && validFirstAndThirdToken.includes(tokenizedClone[0].Type)){
        if(tokenizedClone[0].Type == "Identifier"){
            let existingVar = flowgram.getVariable(tokenizedClone[0].Token);
            if(!existingVar){
                res.error = "ERROR: Undefined variable '" + tokenizedClone[0].Token + "'.";
                return res;
            }
        }
        res.groupedToken.tokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Relational Operation"
        return res;
    }

    //=================================================
    if (tokenizedClone.length > 0){
        res.error = "ERROR: Invalid Syntax for Relational Operation"
        return res;
    }

    return res;
}
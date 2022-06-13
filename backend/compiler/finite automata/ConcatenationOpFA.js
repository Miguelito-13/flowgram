const validFirstToken = [
    "String Constant",
    "Number Constant",
    "Boolean Constant",
    "Identifier"
]

export default function ConcatenationOpFA(tokenizedText, returnRemaining){
    console.log("- ConcatenationOpFA")
    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "Concatenation Operation"
        },
        remainingTokens: [],
        error: false,
    }

    let state = 0;                                  // 0 = number or variable, 1 = math operator, 2 = (, 3 = )
    while  (tokenizedClone.length > 0){

        if(state == 0 && tokenizedClone[0] && validFirstToken.includes(tokenizedClone[0].Type)){
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            state = 1;
        } else if(state = 1 && tokenizedClone[0] && tokenizedClone[0].Type == "Concatenator"){
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            state = 0;
        } else {
            if(returnRemaining){
                break;
            }

            res.error = "ERROR: Invalid Concatenation Operation";
            return res;
        }

    }

    if (state == 0){
        res.error = "ERROR: Invalid Concatenation Operation";
        return res;
    }

    if (returnRemaining){
        res.remainingTokens = tokenizedClone;
        return res;
    }

    return res;
}
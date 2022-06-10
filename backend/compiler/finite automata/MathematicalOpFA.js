const validFirstToken = [
    "Number Constant",
    "Identifier"
]

export default function MathematicalOpFA(tokenizedText, returnRemaining){
    console.log("- MathematicalOpFA")
    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            groupedTokens: [],
        },
        remainingTokens: [],
        error: false,
    }
    
    let parenthesisCount = 0;
    let pastCount = 1;                                  // 0 = number or variable, 1 = math operator, 2 = (, 3 = )
    let checkedIndex = 0
    while  (tokenizedClone.length > 0){

        if((pastCount == 1 || pastCount == 2) && tokenizedClone[0] && validFirstToken.includes(tokenizedClone[0].Type)){
            res.groupedToken.groupedTokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            pastCount = 0;
        } else if((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Type == "Mathematical Operator"){
            res.groupedToken.groupedTokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            pastCount = 1;
        } else if((pastCount == 1 || pastCount == 2) && tokenizedClone[0] && tokenizedClone[0].Token == "("){
            res.groupedToken.groupedTokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            parenthesisCount++;
            pastCount = 2;
        } else if((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Token == ")"){
            res.groupedToken.groupedTokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            parenthesisCount--;
            pastCount = 3;
        } else {
            if(returnRemaining){
                break;
            }

            res.error = "ERROR: Invalid Mathematical Operation";
            return res;
        }

        checkedIndex++;

    }

    if(parenthesisCount > 0){
        res.error = "ERROR: Invalid Mathematical Operation, Missing ')' Symbol";
        return res;
    } else if(parenthesisCount < 0){
        res.error = "ERROR: Invalid Mathematical Operation, Unexpected ')' Symbol";
        return res;
    }

    res.groupedToken = {
        groupedTokens: [...tokenizedText].splice(0, checkedIndex),
        groupedTokensType: "Mathematical Operation"
    };

    if (returnRemaining){
        res.remainingTokens = tokenizedClone;
    }

    return res;
}
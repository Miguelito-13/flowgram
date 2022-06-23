const validFirstToken = [
    "Number Constant",
    "Negative Number Constant",
    "Identifier"
]

export default function MathematicalOpFA(tokenizedText, returnRemaining){
    console.log("- MathematicalOpFA")
    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "Mathematical Operation"
        },
        remainingTokens: [],
        error: false,
    }
    
    let parenthesisCount = 0;
    let pastCount = 1;                                  // 0 = number or variable, 1 = math operator, 2 = (, 3 = )
    let checkedIndex = 0
    while  (tokenizedClone.length > 0){
        console.log("TokenToken:", tokenizedClone[0], " State: ", pastCount)
        console.log((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Type == "Negative Number Constant")

        if((pastCount == 1 || pastCount == 2) && tokenizedClone[0] && validFirstToken.includes(tokenizedClone[0].Type)){
            if(tokenizedClone.Type == "Negative Number Constant"){
                tokenizedClone[0].Type == "Number Constant";
            }
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            pastCount = 0;
        } else if((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Type == "Mathematical Operator"){
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            pastCount = 1;
        } else if((pastCount == 1 || pastCount == 2) && tokenizedClone[0] && tokenizedClone[0].Token == "("){
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            parenthesisCount++;
            pastCount = 2;
        } else if((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Token == ")"){
            res.groupedToken.tokens.push(tokenizedClone[0]);
            tokenizedClone.shift()
            parenthesisCount--;
            pastCount = 3;
        } else if((pastCount == 0 || pastCount == 3) && tokenizedClone[0] && tokenizedClone[0].Type == "Negative Number Constant"){
            res.groupedToken.tokens.push({
                Token: "-",
                Type: "Mathematical Operator"
            })

            res.groupedToken.tokens.push({
                Token: Math.abs(tokenizedClone[0].Token),
                Type: "Number Constant"
            });

            tokenizedClone.shift()
            pastCount = 0;
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

    if (returnRemaining){
        res.remainingTokens = tokenizedClone;
    }

    return res;
}
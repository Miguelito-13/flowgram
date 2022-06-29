import RelationalOpFA from "./RelationalOpFA.js"

const validFirstAndThirdToken = [
    "Boolean Constant",
    "Identifier"
]

export default function LogicalOpFA(tokenizedText, flowgram){
    //console.log("- LogicalOpFA")

    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "Logical Operation"
        },
        error: false,
    }

    let state = 0
    let parenthesisCount = 0
    while (tokenizedClone.length > 0){
        
        //=================================================
        if (state == 0 ){
            const relationalParam = [tokenizedClone[0], tokenizedClone[1], tokenizedClone[2]]
            const result = RelationalOpFA(relationalParam, flowgram)
            if(!result.error){
                res.groupedToken.tokens.push(result.groupedToken)
                tokenizedClone.splice(0, 3);
                state = 1;
            } else {
                if (state == 0 && tokenizedClone[0] && validFirstAndThirdToken.includes(tokenizedClone[0].Type)){
                    if(tokenizedClone[0].Type == "Identifier"){
                        let existingVar = flowgram.getVariable(tokenizedClone[0].Token);
                        if(!existingVar){
                            res.error = "COMPILATION ERROR: Undefined variable '" + tokenizedClone[0].Token + "'.";
                            return res;
                        }
                    }
                    res.groupedToken.tokens.push(tokenizedClone[0])
                    tokenizedClone.shift()
                    state = 1;
                } else if (state == 0 && tokenizedClone[0] && tokenizedClone[0].Token == "("){
                    res.groupedToken.tokens.push(tokenizedClone[0])
                    tokenizedClone.shift()
                    parenthesisCount++;
                    state = 0;
                } else {
                    res.error = "COMPILATION ERROR: Invalid Syntax for Logical Operation"
                    return res;
                }
            }

        }

        //=================================================
        if (state == 1 && tokenizedClone[0] && tokenizedClone[0].Type == "Logical Operator"){
            res.groupedToken.tokens.push(tokenizedClone[0])
            tokenizedClone.shift()
            state = 0;
        } else if(state == 1 && tokenizedClone[0] && tokenizedClone[0].Token == ")"){
            res.groupedToken.tokens.push(tokenizedClone[0])
            tokenizedClone.shift()
            parenthesisCount--;
            state = 1;
        } else if(state == 1 && tokenizedClone.length > 0){
            res.error = "COMPILATION ERROR: Invalid Syntax for Logical Operation"
            return res;

        } else if(state == 1){
            break;
        }
    }

    if (state == 0){
        res.error = "COMPILATION ERROR: Invalid Syntax for Logical Operation"
        return res;
    }

    
    if (parenthesisCount > 0){
        res.error = "COMPILATION ERROR: Missing ')' symbol"
        return res;
    } else if (parenthesisCount < 0){
        res.error = "COMPILATION ERROR: Unexpected ')' Symbol"
        return res;
    }

    return res;
}
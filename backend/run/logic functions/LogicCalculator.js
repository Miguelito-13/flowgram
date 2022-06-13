export default function LogicCalculator(logicalOp, flowgram){
    
    let res = {
        result: null,
        error: false,
    }

    let opClone = [...logicalOp]
    const ret = replaceIdentifiers(opClone, "Logical", flowgram);                            //Replace all variables with their values ex. x AND true -> true AND true
    if(ret.error){
        res.error = ret.error;
        return res;
    }

    while(opClone.length > 1){                                                  
        let highestPeak = 0
        let parenthesisCount = 0
        let openIndex = 0
        let closeIndex = 0
    
        opClone.forEach((v, i) => {                                             //Get highest prio operation to be calculated enclosed in () ex. ((true AND 4==4) OR true) -> (true AND 4==4)
            if(v.Token == "("){
                parenthesisCount++;
                if(parenthesisCount > highestPeak){
                    highestPeak = parenthesisCount;
                    openIndex = i;
                    closeIndex = 0;
                }
            }
            if(v.Token == ")"){
                parenthesisCount--;
                if(highestPeak != 0){
                    closeIndex = i;
                }
            }
        })
    
        if(highestPeak != 0){
            let subOp = []
            for(i = openIndex; i <= closeIndex; i++){
                subOp.push(opClone[i]);
            }
    
            opClone[openIndex] = calculate(subOp, flowgram);                              //Calculate the highest prio operation and replace it with the result ex. ((true AND 4==4) OR true) -> (true OR true)
            opClone.splice((openIndex + 1), (closeIndex - openIndex));
        } else {
            if(opClone.length > 1){
                opClone[0] = calculate(opClone, flowgram);                                    //Calculate the simplified logical operation ex. true OR true -> true
            } else {
                opClone[0] = calculateRelation(opClone, flowgram);
            }
        }
    }

    res.result = opClone;
    return res;

}


//Calculate a logical operation
function calculate(logicOp, flowgram){

    let cloneOp = [...logicOp]
    cloneOp.shift()
    cloneOp.pop()

    while(cloneOp.length > 1){
        for(let i = 0; i < cloneOp.length; i++){
            let result
            if(cloneOp[i].Token == "AND"){
                result = calculateRelation(cloneOp[i-1], flowgram) && calculateRelation(cloneOp[i+1], flowgram);
            } else if(cloneOp[i].Token == "OR"){
                result = calculateRelation(cloneOp[i-1], flowgram) || calculateRelation(cloneOp[i+1], flowgram);
            }

            cloneOp[i-1] = {
                Token: result,
                Type: "Boolean Constant"
            }
            cloneOp.splice(i, 2);
        }
    }

    return cloneOp;
}

//Calculate a relational operation
function calculateRelation(relationalOp, flowgram){
    if(relationalOp.Type == "Boolean Constant"){
        return relationalOp.Token;
    }

    if(relationalOp.groupedTokensType == "Relational Operation"){
        let tokenizedTexts = replaceIdentifiers(relationalOp.tokens, "Relational", flowgram).replacedOp
        if(tokenizedTexts && tokenizedTexts[1].Token == "=="){
            return tokenizedTexts[0].Token == tokenizedTexts[2].Token

        } else if(tokenizedTexts && tokenizedTexts[1].Token == "!="){
            return tokenizedTexts[0].Token != tokenizedTexts[2].Token

        } else {
            if(tokenizedTexts[0].Type == "Number Constant" && tokenizedTexts[2].Type == "Number Constant"){
                if(tokenizedTexts && tokenizedTexts[1].Token == ">"){
                    return parseFloat(tokenizedTexts[0].Token) > parseFloat(tokenizedTexts[2].Token)
        
                } else if(tokenizedTexts && tokenizedTexts[1].Token == "<"){
                    return parseFloat(tokenizedTexts[0].Token) < parseFloat(tokenizedTexts[2].Token)
        
        
                } else if(tokenizedTexts && tokenizedTexts[1].Token == ">="){
                    return parseFloat(tokenizedTexts[0].Token) >= parseFloat(tokenizedTexts[2].Token)
        
        
                } else if(tokenizedTexts && tokenizedTexts[1].Token == "<="){
                    return parseFloat(tokenizedTexts[0].Token) <= parseFloat(tokenizedTexts[2].Token)
        
        
                }
            }
        }
    }


}

//Replaces all Identifiers with its value
function replaceIdentifiers(op, opType, flowgram){

    let res = {
        replacedOp: null,
        error: false
    }
    let cloneOp = [...op];

    for(let i = 0; i < cloneOp.length; i++){
        if(cloneOp[i].Type == "Identifier"){
            const existingVar = flowgram.getVariable(cloneOp[i].Token)
            if(opType == "Logical"){
                if(existingVar.type == "Boolean"){
                    cloneOp[i] = {
                        Token: existingVar.value,
                        Type: "Boolean Constant"
                    }
                } else {
                    res.error = "RUNTIME ERROR: Variable " + cloneOp[i].Token + " is Not a Boolean"
                    return res;
                }
            } else {
                cloneOp[i] = {
                    Token: existingVar.value,
                    Type: existingVar.type + " Constant"
                }
            }
        }
    }

    res.replacedOp = cloneOp;
    return res;

}
export default function Calculator(mathematicalOp, flowgram){

    let res = {
        result: null,
        error: false,
    }

    let opClone = [...mathematicalOp]
    const ret = replaceIdentifiers(opClone, flowgram);                          //Replace all variables with their values ex. x + 1 -> 1 + 1
    if(ret.error){
        res.error = ret.error;
        return res;
    }

    opClone = ret.replacedOp

    while(opClone.length > 1){                                                  
        let highestPeak = 0
        let parenthesisCount = 0
        let openIndex = 0
        let closeIndex = 0
    
        opClone.forEach((v, i) => {                                             //Get highest prio operation to be calculated enclosed in () ex. ((1+1) + 2) -> (1+1)
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
                if(highestPeak != 0 && closeIndex == 0){
                    closeIndex = i;
                }
            }
        })
    
        if(highestPeak != 0){
            let subOp = []
            for(let i = openIndex; i <= closeIndex; i++){
                subOp.push(opClone[i]);
            }
    
            let result = calculate(subOp);                                      //Calculate the highest prio operation and replace it with the result ex. ((1 + 1) + 2) -> (2+2)
            if(result.error){
                res.error = result.error;
                return res;
            }
            opClone[openIndex] = result.result;                              
            opClone.splice((openIndex + 1), (closeIndex - openIndex));
            openIndex = 0;
            closeIndex = 0;
        } else {
            let result = calculate(opClone);                                    //Calculate the simplified mathematical operation ex. 2 + 2 -> 4
            if(result.error){
                res.error = result.error;
                return res;
            }
            opClone[0] = result.result;                                    
        }
    }

    res.result = opClone[0]
    return res;
}

//Replaces all Identifiers with its value (if the variable is of type "Number")
function replaceIdentifiers(mathOp, flowgram){

    let res = {
        replacedOp: null,
        error: false
    }
    let cloneOp = [...mathOp];

    for(let i = 0; i < cloneOp.length; i++){
        if(cloneOp[i].Type == "Identifier"){
            const existingVar = flowgram.getVariable(cloneOp[i].Token)
            if(existingVar.type == "Number"){
                cloneOp[i] = {
                    Token: existingVar.value,
                    Type: "Number Constant"
                }
            } else {
                res.error = "RUNTIME ERROR: Variable " + cloneOp[i].Token + " is Not a Number"
                return res;
            }
        }
    }

    res.replacedOp = cloneOp;
    return res;

}

//Calculate a mathematical operation following MDAS rule
function calculate(mathOp){

    let res = {
        result: null,
        error: false
    }

    let cloneOp = [...mathOp]
    if(cloneOp[0].Token == "("){
        cloneOp.shift()
        cloneOp.pop()
    }

    let status = "MD"                                   //MD - Multiply/Divide      AS - Add/Subtract
    while(cloneOp.length > 1){
        for(let i = 0; i < cloneOp.length; i++){
            if(cloneOp[i].Type == "Mathematical Operator"){
                let result
                if(status == "MD" && cloneOp[i].Token == "*"){
                    result = parseFloat(cloneOp[i-1].Token) * parseFloat(cloneOp[i+1].Token);
                    console.log("Operation:", cloneOp[i-1].Token, cloneOp[i].Token, cloneOp[i+1].Token)
                    cloneOp[i-1] = {
                        Token: result,
                        Type: "Number Constant"
                    }
        
                    cloneOp.splice(i, 2);
                    i--;

                } else if(status == "MD" && cloneOp[i].Token == "/"){               //TODO return error when i+1 is 0
                    if(parseFloat(cloneOp[i+1].Token) == 0){
                        res.error = "RUNTIME ERROR: Cannot divide number with 0";
                        return res;
                    }
                    result = parseFloat(cloneOp[i-1].Token) / parseFloat(cloneOp[i+1].Token);
                    console.log("Operation:", cloneOp[i-1].Token, cloneOp[i].Token, cloneOp[i+1].Token)
                    cloneOp[i-1] = {
                        Token: result,
                        Type: "Number Constant"
                    }
        
                    cloneOp.splice(i, 2);
                    i--;

                } else if(status == "AS" && cloneOp[i].Token == "+"){
                    result = parseFloat(cloneOp[i-1].Token) + parseFloat(cloneOp[i+1].Token);
                    console.log("Operation:", cloneOp[i-1].Token, cloneOp[i].Token, cloneOp[i+1].Token)
                    cloneOp[i-1] = {
                        Token: result,
                        Type: "Number Constant"
                    }
        
                    cloneOp.splice(i, 2);
                    i--;

                } else if(status == "AS" && cloneOp[i].Token == "-"){
                    result = parseFloat(cloneOp[i-1].Token) - parseFloat(cloneOp[i+1].Token);
                    console.log("Operation:", cloneOp[i-1].Token, cloneOp[i].Token, cloneOp[i+1].Token.Token)
                    cloneOp[i-1] = {
                        Token: result,
                        Type: "Number Constant"
                    }
        
                    cloneOp.splice(i, 2);
                    i--;
                }
            }
        }

        status = status == "MD" ? "AS" : null;
    }

    res.result = cloneOp[0]
    return res;
}

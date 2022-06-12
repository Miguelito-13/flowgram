import Calculator from "../logic functions/Calculator.js";
import Concatenator from "../logic functions/Concatenator.js";

const validValues = {
    ConstantsAndVariables: [
        "Identifier",
        "Number Constant",
        "String Constant",
        "Boolean Constant"
    ],
    ValidGroupedTypes: [
        "Mathematical Operation",
        "Concatenation Operation"
    ]
}

export default function ProcessLogic(groupedTokens, flowgram){

    let res = {
        error: false
    }

    let groupedClone = [...groupedTokens];
    let varInfo = {
        variableName: null,
        value: null,
        type: null
    }


    let state = 0;                          //0 - variable name, 1 - equal sign, 2 - value (constants, mathematical op, concatenation, another variable)
    while(groupedClone.length > 0){
        if (state == 0 && groupedClone[0].Type == "Identifier"){
            varInfo.variableName = groupedClone[0].Token
            groupedClone.shift()
        } else if(state == 1 && groupedClone[0].Type == "Assign Operator"){
            groupedClone.shift()
        } else if(state == 2){
            if(validValues.ConstantsAndVariables.includes(groupedClone[0].Type)){                   // Constant or variable
                if(groupedClone[0].Type == "Identifier"){
                    const existingVar = flowgram.getVariable(groupedClone[0].Token);
                    if(existingVar){
                        varInfo.value = existingVar.value
                        varInfo.type = existingVar.type
                        groupedClone.shift()
                    }
                }
            } else if(validValues.ValidGroupedTypes[0] == groupedClone[0].groupedTokensType){       //Mathematical Operation
                const ret = Calculator(groupedClone[0].groupedTokens, flowgram);
                if(ret.error){
                    res.error = ret.error;
                    return res;
                }

                varInfo.value = ret.result.Token
                varInfo.type = ret.result.Type
                groupedClone.shift()

            } else if(validValues.ValidGroupedTypes[1] == groupedClone[0].groupedTokensType){       //Concatenation
                const ret = Concatenator(groupedClone[0].groupedTokens, flowgram);
                if(ret.error){
                    res.error = ret.error;
                    return res;
                }

                varInfo.value = ret.result.Token
                varInfo.type = ret.result.Type
                groupedClone.shift()
            }

            if(varInfo.variableName && varInfo.value != null && varInfo.type){
                const existingVar = flowgram.getVariable(varInfo.variableName);
                if(existingVar){
                    flowgram.addVariable(varInfo.variableName, varInfo.value, varInfo.type);
                } else {
                    flowgram.updateVariable(varInfo.variableName, varInfo.value, varInfo.type);
                }
            }
        }
    }

    return res;
}
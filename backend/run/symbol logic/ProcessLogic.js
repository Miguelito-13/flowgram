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


    let state = 0;                          //0 - variable name, 1 - equal sign, 2 - value (constants, mathematical op, concatenation, another variable)
    while(groupedClone.length > 0){
        if (state == 0 && groupedClone[0].Type == "Identifier"){

        } else if(state == 1 && groupedClone[0].Type == "Assign Operator"){

        } else if(state == 2){
            if(validValues.ConstantsAndVariables.includes(groupedClone[0].Type)){                   // Consant or variable

            } else if(validValues.ValidGroupedTypes[0] == groupedClone[0].groupedTokensType){       //Mathematical Operation

            } else if(validValues.ValidGroupedTypes[1] == groupedClone[0].groupedTokensType){       //Concatenation
                
            }
        }
    }

}
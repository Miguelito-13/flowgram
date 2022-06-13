

export default function StartEndFA(tokenizedText){
    console.log("- StartEndFA")
    
    let tokenizedClone = [...tokenizedText]
    let res = {
        groupedToken: {
            tokens: [],
            groupedTokensType: "StartEnd"
        },
        error: false,
    }

    //=================================================
    if (tokenizedClone[0] && tokenizedClone[0].Token == "START" || tokenizedClone[0].Token == "END"){
        res.groupedToken.tokens.push(tokenizedClone[0])
        tokenizedClone.shift()
    } else {
        res.error = "ERROR: Invalid Syntax for Start/End symbol"
        return res;
    }

    //=================================================
    if (tokenizedClone.length > 0){
        res.error = "ERROR: Invalid Syntax for Start/End symbol"
        return res;
    }

    return res;
}
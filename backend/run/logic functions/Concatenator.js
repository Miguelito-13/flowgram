export default function Concatenator(concatenationOp, flowgram){

    let res = {
        result: "",
        error: false
    }

    let cloneOp = [...concatenationOp]

    for(let i = 0; i < cloneOp.length; i++){
        if(cloneOp[i].Type == "Identifier"){
            const existingVar = flowgram.getVariable(cloneOp[i].Token);
            if(!existingVar){
                res = "RUNTIME ERROR: Variable doesn't exist"
                return res;
            }
            res.result += existingVar.value;

        } else {
            if(cloneOp[i].Type == "String Constant"){
                res.result += cloneOp[i].Token.replace(/["]/g, "");
            } else {
                res.result += cloneOp[i].Token;
            }
        }
    }

    return res;
}
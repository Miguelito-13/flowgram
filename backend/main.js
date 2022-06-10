import { NotifyError, NotifySuccess} from './common/Notify.js'
import Compile from "./compiler/Compile.js";
import Flowgram from "./structure/Flowgram.js";

export function newFlowgram(name){
    console.log("Created new flowgram");
    return new Flowgram(name);
}

export default async function startRunCompile(flowgram){
    if (!flowgram){
        NotifyError("ERROR: Missing flowgram");
    }


    try{
        await flowgram.resetFlowgram();
        await Compile(flowgram.main.start, flowgram.main.start, flowgram);

        if(flowgram.main.end){
            NotifySuccess("Finished Compiling");
        } else {
            NotifyError("ERROR: Missing End Symbol");
        }

        flowgram.status.run = false;
        console.log(flowgram)
    } catch({symbol, error}){
        NotifyError(symbol, error);
    }
}



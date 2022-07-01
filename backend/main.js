import { NotifyError, NotifySuccess} from './common/Notify.js'
import Compile from "./compiler/Compile.js";
import Run from './run/Run.js';
import Flowgram from "./structure/Flowgram.js";

export function createFlowgram(name){
    //console.log("Created new flowgram");
    return new Flowgram(name);
}

export default async function startRunCompile(flowgram){
    if (!flowgram){
        NotifyError("ERROR: Missing flowgram");
    }


    try{
        flowgram.status.run = true;
        //console.log("**************************************")
        //console.log("COMPILING...")
        await flowgram.resetFlowgram();
        await Compile(flowgram.main.start, flowgram.main.start, flowgram);

        if(flowgram.main.end){
            NotifySuccess(" ")
        } else {
            flowgram.status.run = false;
            NotifyError("COMPILATION ERROR: Missing End Symbol");
            return;
        }
        //console.log("**************************************")
        //console.log("FINISHED COMPILING\n", flowgram)
        
        flowgram.resetVariables()
        //console.log("**************************************")
        //console.log("RUNNING...")
        await Run(flowgram.main.start, flowgram);

        flowgram.status.run = false;
        //console.log("**************************************")
        //console.log("FINISHED RUNNING\n", flowgram)
        NotifySuccess("Plowchart Finished Running.")
    } catch({symbol, error}){
        flowgram.status.run = false;
        NotifyError(error, symbol);
    }
}



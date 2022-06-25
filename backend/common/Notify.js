import {displayOutput} from "../../frontend/index.js"

function NotifyError(message, symbol){
    let mes = message + (symbol ? ", Symbol: " + symbol.type : "")
    displayOutput(mes, "error")
}

function NotifySuccess(message, symbol){
    let mes = "Success: " + message + (symbol ? ", Symbol: " + symbol.type : "")
    displayOutput(mes, "success")
}

function NotifyWarning(message, symbol){
    let mes = "Warning: " + message + (symbol ? ", Symbol: " + symbol.type : "")
    displayOutput(mes, "warning")
}

function NotifyText(message){
    displayOutput(message, "text")
}


export {
    NotifyError,
    NotifySuccess,
    NotifyWarning,
    NotifyText
};
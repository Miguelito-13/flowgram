function NotifyError(symbol, message){
    console.error("Error: ", message, "\nSymbol: ", symbol)
}

function NotifySuccess(symbol, message){
    console.log("Error: ", message, "\nSymbol: ", symbol)
}

function NotifyWarning(symbol, message){
    console.warn("Error: ", message, "\nSymbol: ", symbol)
}


export {
    NotifyError,
    NotifySuccess,
    NotifyWarning
};
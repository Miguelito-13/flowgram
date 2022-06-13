export default function Run(symbol, flowgram){

    return new Promise((resolve, reject) => {
        
        if(symbol.type == "StartEnd"){
            const groupedTokens = [...symbol.groupedTokens.tokens]
            if(groupedTokens[0].Token == "Start"){
                
            }
        }

    })

}
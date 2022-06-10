const validTypes = [
    "StartEnd",
    "Process",
    "Conditional",
    "InputOutput"
]


/*

    Properties:
        -type
        -text
        -tokenizedText
        -groupedTokens
        -root
        -connections = {
            true:       -- if conditional
            false:      -- if conditional
            out: 
        }
        -checked
*/

export default class Symbol{
    constructor (type, text){
        if(!validTypes.includes(type)){
            console.error("ERROR: Invalid Symbol Type '", type, "'");
        } else {
            this.type = type;
        }
        
        this.groupedTokens = [];
        this.tokenizedText = [];
        this.connections = {};
        this.text = text
    }

    set out(symbol){
        if(this.type == "Conditional"){
            throw new Error("ERROR: Conditional Symbol needs a true or false connection.");
        }

        this.connections.out = symbol;
    }

    get out(){
        return this.connections.out;
    }

    set true(symbol){
        if(this.type != "Conditional"){
            throw new Error("ERROR: Symbol cannot have true or false.");
        }
        
        this.connections.true = symbol;
    }

    get true(){
        return this.connections.true;
    }

    set false(symbol){
        if(this.type != "Conditional"){
            throw new Error("ERROR: Symbol cannot have true or false.");
        }
        
        this.connections.false = symbol;
    }

    get false(){
        return this.connections.false;
    }

    resetSymbol(){
        this.groupedTokens = [];
        this.tokenizedText = [];
        this.checked = false;
        this.root = null;
    }
    
}
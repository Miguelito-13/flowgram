const validTypes = {
    String: [
        "String Constant",
        "String"
    ],
    Number: [
        "Number Constant",
        "Negative Number Constant",
        "Number"
    ],
    Mathematical: [
        "Mathematical Operation",
        "Mathematical",
    ],
    Boolean: [
        "Boolean Constant",
        "Boolean"
    ]
}

export default class Variable{

    constructor(name, value, type){
        this.name = name;
        this.value = {value: value, type: type};
    }

    set name (newName){
        if(newName.length < 1){
            throw Error("ERROR: Variable name is required");
        }
        this._name = newName;
    }

    get name (){
        return this._name;
    }

    set value ({value, type}){
        this.type = validateType(type)
        this._value = value;
        // if(type == "Input"){
        //     this._value = value;

        // } else if(this.type == "String"){
        //     this._value = value.replace(/["]/g, "");
            
        // } else if(this.type == "Boolean"){
        //     if(value == "true"){
        //         this._value = true;
        //     } else if(value == "false"){
        //         this._value = false;
        //     }

        // } else if(this.type == "Number"){
        //     this._value = parseFloat(value)

        // } else {
        //     this._value = value;
        // }
        
    }

    get value (){
        return this._value;
    }

}


function validateType(type){
    let varType
    if (validTypes.String.includes(type)){
        varType = "String"
    } else if (validTypes.Number.includes(type)){
        varType = "Number"
    } else if (validTypes.Mathematical.includes(type)){
        varType = "Mathematical"
    } else if (validTypes.Boolean.includes(type)){
        varType = "Boolean"
    }
    
    return varType;
}

function isANumber(value){
    if(typeof(value) == "string"){
        const num = parseFloat(value);
        if(num && num.toString().length == value.replace(/\s/g, "").length){
            return true;
        } else {
            return false;
        }
    }
}
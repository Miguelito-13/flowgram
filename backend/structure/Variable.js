const validTypes = {
    String: [
        "String Constant",
        "String"
    ],
    Number: [
        "Number Constant",
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
        if(value == "true"){
            this._value = true;
            this.type = "Boolean"
        } else if(value == "false"){
            this._value = false;
            this.type = "Boolean"
        } else if(isANumber(value)) {
            this._value = parseFloat(value)
            this.type = "Number"
        } else if(typeof(value) == "string"){
            this._value = '"' + value + '"';
            this.type = "String"
        } else {
            this._value = value;
        }
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
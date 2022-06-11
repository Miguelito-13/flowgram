import { getElementIndex } from '../common/Functions.js'
import Symbol from './Symbol.js';
import Variable from './Variable.js';

export default class Flowgram{

    constructor(name){
        this.name = name ? name: "New Flowgram";
        this.main = {
            start: new Symbol("StartEnd", "START")
        };
        this.status = {
            compile: false,
            run: false
        }
        this.variables = [];
        this.symbols = [];
    }

    set name(newName){
        this._name = !newName || newName.length < 0 ? "New Flowgram" : newName
    }

    get name(){
        return this._name
    }

    set main(newMain){
        this._main = newMain ? newMain : {
            start: new Symbol("StartEnd", "START")
        };
    }

    get main(){
        return this._main
    }

    addSymbol(type){
        let res = {
            newSymbol: false,
            error: false
        }
        const newSymbol = new Symbol(type);
        if(!newSymbol.type){
            res.error = "ERROR: Invalid symbol type";
            return res;
        }

        this.symbols.push(newSymbol);
        res.newSymbol = newSymbol;

        return res;
    }

    removeSymbol(symbol){
        let res = {
            success: false,
            error: false
        }
        
        const index = getElementIndex(this.symbols, symbol);
        if (!index){
            res.error = "ERROR: Deleting symbol doesnt exist"
        } else {
            this.symbols.splice(index, 1);
            res.success = "Successfully Deleted Symbol";

            this.symbols.forEach((v) => {                   //Remove all connections towards the deleted symbol
                if(v.out && v.out == symbol){
                    v.out = null
                } else if(v.true && v.true == symbol){
                    v.true = null
                } else if(v.false && v.false == symbol){
                    v.false = null
                } 
            });
        }

        return res;
    }

    addVariable(variableName, value, type){
        let res = {
            newVar: false,
            error: false
        }
        const existingVar = this.getVariable(variableName, this.variables);
        if (existingVar){
            res.error = "ERROR: Variable already exist";
            return error;
        }

        const newVariable = new Variable(variableName, value, type);
        if (!newVariable.type){
            res.error = "ERROR: Invalid variable type";
            return res;
        }

        this.variables.push(newVariable);
    }

    updateVariable(variableName, value, type){
        let res = {
            newVar: false,
            error: false
        }

        const existingVar = this.getVariable(variableName, value);
        if(!existingVar){
            res.error = "ERROR: Variable doesn't exist";
            return error;
        }

        existingVar.value = {value: value, type: type};
        if(!existingVar.type){
            res.error = "ERROR: Invalid value type";
            return res;
        }

        return res;
    }

    getVariable(variableName, variableList){
        let list = variableList ? variableList : this.variables
        for(let i = 0; i < list.length; i++){
            if (list[i].name === variableName){
                return list[i];
            }
        }
    }

    resetVariables(){
        this.variables = [];
    }

    resetFlowgram(){

        return new Promise((resolve, reject) => {
            this.main.end = null;
            this.variables = [];
            for(let i = 0; i < this.symbols.length; i++){
                this.symbols[i].resetSymbol();
            }

            resolve();
        })
    }

}

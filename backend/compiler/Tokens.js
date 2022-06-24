const Tokens = [
    {
        pattern: /\s/,
        type: 'Space'
    },
    {
        pattern: /START|END|OUTPUT|INPUT/,
        type: 'Keyword'
    },
    {
        pattern: /true|false/,
        type: 'Boolean Constant'
    },
    {
        pattern: /[-]\d+([.]\d+)?/,
        type: 'Negative Number Constant'
    },
    {
        pattern: /\d+([.]\d+)?/,
        type: 'Number Constant'
    },
    {
        pattern: /(["'])(?:(?=(\\?))\2.)*?\1/,
        type: 'String Constant'
    },
    {
        pattern: />=|<=|==|!=|>|</,
        type: 'Relational Operator'
    },
    {
        pattern: /AND|OR/,
        type: 'Logical Operator'
    },
    {
        pattern: /[+]|[-]|[*]|[/]|[%]/,
        type: 'Mathematical Operator'
    },
    {
        pattern: /=/,
        type: 'Assign Operator'
    },
    {
        pattern: /[(]|[)]/,
        type: 'Parenthesis'
    },
    {
        pattern: /[,]/,
        type: 'Concatenator'
    },
    {
        pattern: /([A-z]|_)\w*/,   
        type: 'Identifier'
    },
]

export default Tokens;
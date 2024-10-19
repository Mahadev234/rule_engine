const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to handle JSON requests
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Function to parse rule string into AST
const parseRuleStringToAST = (ruleString) => {
    try {
        const operators = ['AND', 'OR'];
        const tokens = ruleString.match(/[\w]+|[()=><']/g); // Tokenize rule string

        if (!tokens) throw new Error("Invalid rule string format");

        const parseExpression = (tokens) => {
            let stack = [];
            let currentNode = null;

            while (tokens.length) {
                const token = tokens.shift();

                if (token === '(') {
                    stack.push(currentNode);
                    currentNode = null;
                } else if (token === ')') {
                    const parentNode = stack.pop();
                    if (parentNode) {
                        if (!parentNode.left) parentNode.left = currentNode;
                        else parentNode.right = currentNode;
                        currentNode = parentNode;
                    }
                } else if (operators.includes(token)) {
                    if (!currentNode) throw new Error(`Operator ${token} without left operand`);
                    currentNode = { type: token, left: currentNode };
                } else if (['>', '<', '='].includes(token)) {
                    const attribute = currentNode && currentNode.attribute ? currentNode.attribute : tokens.shift();
                    if (!attribute) throw new Error(`Expected attribute after operator ${token}`);

                    let value = tokens.shift();
                    if (!value) throw new Error(`Expected value after attribute ${attribute}`);
                    value = value.replace(/'/g, ''); // Remove single quotes from value

                    currentNode = {
                        type: 'condition',
                        attribute: attribute,
                        operator: token,
                        value: value
                    };
                } else {
                    if (currentNode) {
                        currentNode.attribute = token;
                    } else {
                        currentNode = { attribute: token };
                    }
                }
            }

            if (!currentNode) throw new Error("Failed to parse the expression");

            return currentNode;
        };

        return parseExpression(tokens);

    } catch (error) {
        console.error("Error in parseRuleStringToAST:", error);
        throw error; // Re-throw to let the calling function handle it
    }
};

// Recursive function to evaluate AST based on user data
const evaluateRule = (node, userData) => {
    if (node.type === 'AND') {
        return evaluateRule(node.left, userData) && evaluateRule(node.right, userData);
    } else if (node.type === 'OR') {
        return evaluateRule(node.left, userData) || evaluateRule(node.right, userData);
    } else if (node.type === 'condition') {
        const { attribute, operator, value } = node;
        switch (operator) {
            case '>':
                return userData[attribute] > value;
            case '<':
                return userData[attribute] < value;
            case '=':
                return userData[attribute] === value;
            default:
                return false;
        }
    }
    return false;
};

// API to parse a rule string and return the AST
app.post('/create_rule', (req, res) => {
    const { ruleString } = req.body;

    console.log("Received ruleString:", ruleString);

    if (!ruleString) {
        console.error("No ruleString provided");
        return res.status(400).send({ error: 'ruleString is required' });
    }

    try {
        const ast = parseRuleStringToAST(ruleString); // Parse the rule string into AST
        res.status(201).send({ message: 'Rule created successfully', ast });
    } catch (error) {
        console.error("Error while parsing rule string:", error); // Log the error details
        res.status(500).send({ error: 'Error parsing rule string' });
    }
});

// API to evaluate the rule based on AST and user data
app.post('/evaluate_rule', (req, res) => {
    const { ruleAst, data } = req.body;

    console.log("Evaluating rule AST:", ruleAst);
    console.log("With user data:", data);

    if (!ruleAst || !data) {
        console.error("ruleAst or data missing");
        return res.status(400).send({ error: 'ruleAst and data are required' });
    }

    try {
        const result = evaluateRule(ruleAst, data); // Evaluate the AST against the user data
        res.status(200).send({ result });
    } catch (error) {
        console.error("Error while evaluating rule:", error); // Log any evaluation error
        res.status(500).send({ error: 'Error evaluating rule' });
    }
});

// Start server on port 4000
app.listen(4000, () => {
    console.log('Backend running on http://localhost:4000');
});
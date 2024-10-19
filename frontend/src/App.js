import { useState } from 'react';
import axios from 'axios';

function App() {
  const [ruleString, setRuleString] = useState(''); // Rule input
  const [jsonData, setJsonData] = useState(''); // JSON data input
  const [ast, setAst] = useState(null); // To hold AST (Abstract Syntax Tree)
  const [result, setResult] = useState(null); // To hold evaluation result

  // Function to create a rule and display AST
  const createRule = async () => {
    try {
      const response = await axios.post('http://localhost:4000/create_rule', {
        ruleString: ruleString,
      });
      console.log('AST:', response.data.ast);
      setAst(response.data.ast); // Set the AST data to display it
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  // Function to evaluate the rule based on input data (JSON format)
  const evaluateRule = async () => {
    try {
      const parsedJson = JSON.parse(jsonData); // Parse JSON input
      const response = await axios.post('http://localhost:4000/evaluate_rule', {
        ruleAst: ast,
        data: parsedJson,
      });
      setResult(response.data.result); // Set the result
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Rule Engine</h1>

        {/* Rule String Input */}
        <div className="mb-6">
          <textarea
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder="Enter rule string (e.g., age > 30 AND department = 'Sales')"
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            onClick={createRule}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            Create Rule
          </button>
        </div>

        {/* JSON Data Input */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Enter JSON Data</h2>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={`{\n  "age": 35,\n  "department": "Sales",\n  "salary": 60000,\n  "experience": 3\n}`}
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          />
        </div>

        {/* AST Display */}
        {ast && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">AST (JSON Format)</h2>
            <pre className="p-3 bg-gray-100 rounded-lg border border-gray-300">{JSON.stringify(ast, null, 2)}</pre>
          </div>
        )}

        {/* Evaluate Rule */}
        <button
          onClick={evaluateRule}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
        >
          Evaluate Rule
        </button>

        {/* Display Result */}
        {result !== null && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Rule Evaluation Result:
            </h3>
            <p className={`text-center text-2xl mt-4 font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
              {result ? 'Eligible' : 'Not Eligible'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

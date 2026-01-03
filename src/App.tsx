import { useState, useMemo } from 'react';
import { SchemaRenderer, SchemaNode } from './SchemaRenderer';
import { calculatorSchema } from './calculatorSchema';
import { todoSchema } from './todoSchema';
import './App.css';

// Safe evaluation for calculator
const safeEval = (expression: string): string => {
  try {
    // Remove any characters that aren't numbers, operators, parentheses, or spaces
    // Allow: 0-9, +, -, *, /, (, ), ., and whitespace
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    
    // Check if expression is empty or invalid
    if (!sanitized.trim() || sanitized.trim() === '') {
      return '0';
    }
    
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    
    // Handle division by zero and other edge cases
    if (!isFinite(result)) {
      return 'Error';
    }
    
    // Format the result - remove unnecessary decimals
    if (Number.isInteger(result)) {
      return String(result);
    } else {
      // Round to 10 decimal places to avoid floating point issues
      return String(Math.round(result * 10000000000) / 10000000000);
    }
  } catch (error) {
    console.error('Calculation error:', error);
    return 'Error';
  }
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [currentSchema, setCurrentSchema] = useState<SchemaNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle schema selection based on prompt
  const handlePromptSubmit = () => {
    const normalizedPrompt = prompt.toLowerCase().trim();
    
    setIsLoading(true);
    
    // Simulate loading animation
    setTimeout(() => {
      if (normalizedPrompt.includes('calculator')) {
        setCurrentSchema(calculatorSchema);
      } else if (normalizedPrompt.includes('todo')) {
        setCurrentSchema(todoSchema);
      } else {
        setCurrentSchema(null);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setTimeout(() => {
      const normalizedPrompt = examplePrompt.toLowerCase().trim();
      setIsLoading(true);
      setTimeout(() => {
        if (normalizedPrompt.includes('calculator')) {
          setCurrentSchema(calculatorSchema);
        } else if (normalizedPrompt.includes('todo')) {
          setCurrentSchema(todoSchema);
        }
        setIsLoading(false);
      }, 300);
    }, 100);
  };

  // Create enhanced schema with dynamic task rendering
  const enhancedSchema = useMemo(() => {
    if (!currentSchema) return null;
    return currentSchema;
  }, [currentSchema]);

  // Action handler for calculator
  const handleCalculatorAction = (action: string, context: any) => {
    const { display = '0', setState, buttonLabel } = context;

    if (!setState) {
      console.error('setState not found in context', context);
      return;
    }

    let newDisplay = display;

    // Map display symbols to evaluation symbols
    const symbolMap: Record<string, string> = {
      '÷': '/',
      '×': '*',
      '−': '-',
      '+': '+',
    };

    switch (action) {
      case 'number':
        if (newDisplay === '0' || newDisplay === 'Error') {
          newDisplay = buttonLabel;
        } else {
          // Remove trailing spaces before adding number
          newDisplay = newDisplay.trimEnd() + buttonLabel;
        }
        break;
      case 'operator':
        if (newDisplay !== '0' && newDisplay !== 'Error') {
          // Remove trailing spaces and operator if present, then add new operator
          newDisplay = newDisplay.trimEnd();
          // Remove trailing operator if exists (check for both display and eval symbols)
          // Escape special regex characters
          if (/[+\-*/÷×−]$/.test(newDisplay)) {
            newDisplay = newDisplay.slice(0, -1).trimEnd();
          }
          // Only add operator if display doesn't end with an operator already
          if (!/[+\-*/÷×−]$/.test(newDisplay.trimEnd())) {
            newDisplay += ` ${buttonLabel} `;
          } else {
            // Replace the last operator with the new one
            newDisplay = newDisplay.slice(0, -1).trimEnd() + ` ${buttonLabel} `;
          }
        }
        break;
      case 'equals':
        // Convert display symbols to evaluation symbols
        let evalExpression = newDisplay.trim();
        Object.entries(symbolMap).forEach(([displaySymbol, operatorSymbol]) => {
          // Escape special regex characters in displaySymbol
          const escapedSymbol = displaySymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          evalExpression = evalExpression.replace(new RegExp(escapedSymbol, 'g'), operatorSymbol);
        });
        newDisplay = safeEval(evalExpression);
        break;
      case 'clear':
        newDisplay = '0';
        break;
    }

    // Update state with new display value
    setState({ display: newDisplay });
  };

  // Action handler for todo list
  const handleTodoAction = (action: string, context: any) => {
    const { tasks = [], inputValue = '', setState, id, taskId } = context;
    const targetTaskId = id || taskId; // Support both id and taskId

    if (!setState) {
      console.error('setState not found in todo context', context);
      return;
    }

    switch (action) {
      case 'updateInput':
        setState({ 
          tasks, 
          inputValue: context.value || '' 
        });
        break;
      case 'addTask':
        if (inputValue && inputValue.trim()) {
          const newTask = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false,
          };
          setState({
            tasks: [...tasks, newTask],
            inputValue: '',
          });
        }
        break;
      case 'markComplete':
        if (targetTaskId !== undefined) {
          setState({
            tasks: tasks.map((task: any) =>
              task.id === targetTaskId
                ? { ...task, completed: !task.completed }
                : task
            ),
            inputValue,
          });
        }
        break;
      case 'deleteTask':
        if (targetTaskId !== undefined) {
          setState({
            tasks: tasks.filter((task: any) => task.id !== targetTaskId),
            inputValue,
          });
        }
        break;
    }
  };

  // Enhanced schema renderer that handles dynamic task list
  const renderSchema = () => {
    if (!enhancedSchema) return null;

    // Special handling for todo schema to render tasks dynamically
    if (enhancedSchema === todoSchema) {
      return (
        <div className="schema-container">
          <SchemaRenderer
            schema={enhancedSchema}
            onAction={handleTodoAction}
          />
        </div>
      );
    }

    // Calculator schema
    return (
      <div className="schema-container">
        <SchemaRenderer
          schema={enhancedSchema}
          onAction={handleCalculatorAction}
        />
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="prompt-section">
        <h1 className="prompt-title">Convo Feature Builder</h1>
        <p className="prompt-subtitle">
          Describe what you want to build, and watch it come to life
        </p>
        <div className="prompt-input-container">
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePromptSubmit()}
            placeholder="Try: 'Create a calculator' or 'Create a todo list'"
            disabled={isLoading}
          />
          <button
            className="prompt-button"
            onClick={handlePromptSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create App'}
          </button>
        </div>
        <div className="example-prompts">
          <div
            className="example-prompt"
            onClick={() => handleExampleClick('Create a calculator')}
          >
            🧮 Calculator
          </div>
          <div
            className="example-prompt"
            onClick={() => handleExampleClick('Create a todo list')}
          >
            📝 Todo List
          </div>
        </div>
      </div>

      {renderSchema()}
    </div>
  );
}

export default App;

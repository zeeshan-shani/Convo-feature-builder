# Convo Feature Builder

A schema-driven UI runtime system that dynamically renders interactive React applications from JSON schemas. This project demonstrates how to build a flexible, extensible UI framework where user interfaces are defined declaratively and rendered at runtime.

## 🎯 Overview

Convo Feature Builder is an AI-ready app builder that transforms JSON schemas into fully functional React applications. Users describe what they want to build (e.g., "Create a calculator" or "Create a todo list"), and the system renders a complete, interactive UI based on predefined schemas.

## 🏗️ Architecture

The system follows a three-layer architecture:

```
┌─────────────────────────────────────────┐
│         App Layer (App.tsx)              │
│  - Handles user prompts                  │
│  - Manages schema selection              │
│  - Provides action handlers              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    Schema Renderer (SchemaRenderer.tsx) │
│  - Recursively maps schemas to primitives│
│  - Resolves context variables            │
│  - Binds events to action handlers       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Primitives (Primitives.tsx)         │
│  - Container, Text, Button, Grid, etc.   │
│  - Reusable UI building blocks           │
└─────────────────────────────────────────┘
```

## 🔄 Execution Flow

### 1. **Primitives Layer** (`Primitives.tsx`)

The foundation of the system consists of atomic UI components:

- **Container**: Flex-based layout component with configurable direction, gap, padding, and alignment
- **Text**: Typography component with styling options
- **Button**: Interactive button with click handlers and visual states
- **Grid**: CSS Grid layout with configurable columns
- **Input**: Text input field with change handlers
- **List**: Dynamic list renderer for arrays
- **State**: State management primitive that wraps children and provides state/updater functions

These primitives are pure React components that accept props and render UI. They don't know about schemas—they're just building blocks.

### 2. **Schema Definitions** (`calculatorSchema.ts`, `todoSchema.ts`)

Schemas are JSON-like structures that describe UI hierarchies:

```typescript
{
  type: 'Container',
  props: { flexDirection: 'column', gap: 16 },
  children: [
    {
      type: 'State',
      props: { initialState: { display: '0' } },
      children: [
        { type: 'Text', props: { content: '{{display}}' } },
        { type: 'Button', props: { label: '1' }, onClick: 'number' }
      ]
    }
  ]
}
```

Key features:
- **Type mapping**: Each `type` maps to a primitive component
- **Context references**: `{{display}}` syntax references state/context values
- **Event binding**: `onClick` and `onChange` reference action handler names
- **Nested structure**: Children arrays create component trees

### 3. **Schema Renderer** (`SchemaRenderer.tsx`)

The renderer is the engine that transforms schemas into React components:

**Context Resolution:**
- Scans props for `{{key}}` patterns
- Resolves them from the current context (state values, parent context, etc.)
- Handles nested property access like `{{tasks.length}}`
- Supports ternary expressions for conditional rendering

**Recursive Rendering:**
- Maps each schema node's `type` to the corresponding primitive
- Resolves all props with context substitution
- Recursively renders children
- Binds `onClick`/`onChange` events to action handlers

**State Management:**
- When encountering a `State` type, creates a React state instance
- Merges state into context for child components
- Provides `setState` function to context for action handlers

### 4. **App Layer** (`App.tsx`)

The application layer orchestrates everything:

**Schema Selection:**
- User enters a prompt (e.g., "Create a calculator")
- App matches prompt to a schema definition
- Passes selected schema to SchemaRenderer

**Action Handlers:**
- Calculator actions: `number`, `operator`, `equals`, `clear`
- Todo actions: `updateInput`, `addTask`, `markComplete`, `deleteTask`
- Handlers receive action name and context (including state and setState)
- Update state using the provided `setState` function
- State updates trigger re-renders with new context values

## 🔧 How It Works

### Example: Calculator Flow

1. **User clicks "7" button:**
   ```
   Button onClick → SchemaRenderer.handleClick() 
   → App.handleCalculatorAction('number', { display: '0', buttonLabel: '7', setState })
   → setState({ display: '7' })
   → State component re-renders
   → Context updates: { display: '7' }
   → Text component resolves {{display}} → '7'
   → UI updates to show "7"
   ```

2. **User clicks "+" operator:**
   ```
   Button onClick → handleCalculatorAction('operator', { display: '7', buttonLabel: '+', setState })
   → setState({ display: '7 + ' })
   → Display shows "7 + "
   ```

3. **User clicks "=" equals:**
   ```
   Button onClick → handleCalculatorAction('equals', { display: '7 + 2', setState })
   → Converts display symbols (÷→/, ×→*, etc.)
   → Evaluates expression safely
   → setState({ display: '9' })
   → Display shows "9"
   ```

### Context Propagation

Context flows down the component tree:
- Root context: `{}`
- State component adds: `{ display: '7', setState: fn }`
- Child components receive: `{ display: '7', setState: fn }`
- Text component resolves: `{{display}}` → `'7'`

When state updates, React re-renders the State component, creating new context with updated values, which propagates to all children.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

```bash
npm run build
```

## 📝 Usage

1. **Enter a prompt** in the input field:
   - "Create a calculator"
   - "Create a todo list"

2. **Click "Create App"** or press Enter

3. **Interact with the rendered app:**
   - Calculator: Click numbers and operators, press = to calculate
   - Todo: Type tasks, click "Add Task", mark complete, delete tasks

## 🎨 Current Features

### Calculator
- Full arithmetic operations (+, -, ×, ÷)
- Decimal number support
- Clear function
- Error handling
- Modern, polished UI with animations

### Todo List
- Add new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Task counter
- Empty state display
- Smooth animations

## 🔮 Extensibility

### Adding New Primitives

1. Create component in `Primitives.tsx`:
```typescript
export const MyPrimitive: React.FC<MyPrimitiveProps> = ({ ... }) => {
  return <div>...</div>;
};
```

2. Add to SchemaRenderer type union:
```typescript
type: 'Container' | 'Text' | ... | 'MyPrimitive'
```

3. Add case in SchemaRenderer switch:
```typescript
case 'MyPrimitive':
  return <MyPrimitive {...resolvedProps} />;
```

### Adding New Schemas

1. Create schema file (e.g., `myAppSchema.ts`):
```typescript
export const myAppSchema: SchemaNode = {
  type: 'Container',
  props: { ... },
  children: [ ... ]
};
```

2. Import in `App.tsx` and add prompt matching:
```typescript
if (normalizedPrompt.includes('my app')) {
  setCurrentSchema(myAppSchema);
}
```

3. Create action handler:
```typescript
const handleMyAppAction = (action: string, context: any) => {
  // Handle actions
};
```

## 🧠 Technical Decisions

### Why This Architecture?

1. **Separation of Concerns**: Primitives are pure UI, schemas are data, renderer is logic
2. **Extensibility**: Easy to add new primitives or schemas without touching core logic
3. **Type Safety**: TypeScript ensures schema structure matches component props
4. **Performance**: React's reconciliation handles efficient updates
5. **AI-Ready**: Schemas can be generated by AI models in the future

### State Management

- Uses React's built-in `useState` for simplicity
- State component provides state/updater to children via context
- Action handlers receive `setState` from context
- State updates trigger re-renders with new context values

### Context Resolution

- Template syntax `{{key}}` for simple values
- Nested access `{{tasks.length}}` for object properties
- Ternary expressions for conditional rendering
- Recursive resolution for nested objects

## 📚 Project Structure

```
src/
├── App.tsx              # Main application, prompt handling, action handlers
├── SchemaRenderer.tsx   # Core renderer engine
├── Primitives.tsx       # UI building blocks
├── calculatorSchema.ts  # Calculator schema definition
├── todoSchema.ts        # Todo list schema definition
├── App.css             # Application styles
└── index.css           # Global styles and animations
```

## 🛠️ Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS3**: Styling with animations and transitions

## 🤝 Contributing

This is a demonstration project. To extend it:

1. Add new primitives for more UI capabilities
2. Create new schemas for different app types
3. Enhance the renderer for more complex features
4. Integrate AI for dynamic schema generation

## 📄 License

This project is for demonstration purposes.

---

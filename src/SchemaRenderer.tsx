import React from 'react';
import { Container, Text, Button, Grid, State, Input, List } from './Primitives';

// Schema type definitions
export interface SchemaNode {
  type: 'Container' | 'Text' | 'Button' | 'Grid' | 'State' | 'Input' | 'List';
  props?: Record<string, any>;
  children?: SchemaNode[];
  onClick?: string; // Reference to a function name or action
  onChange?: string; // Reference to a function name or action
  itemSchema?: SchemaNode; // For List type - schema for each item
}

export interface SchemaContext {
  [key: string]: any;
}

interface SchemaRendererProps {
  schema: SchemaNode;
  context?: SchemaContext;
  onAction?: (action: string, ...args: any[]) => void;
}

// Safe evaluation for calculator (demo purposes)
const safeEval = (expression: string): string => {
  try {
    // Remove any non-math characters for safety
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    return String(result);
  } catch (error) {
    return 'Error';
  }
};

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  schema,
  context = {},
  onAction,
}) => {
  if (!schema) {
    return null;
  }

  const { type, props = {}, children = [], onClick, onChange } = schema;

  // Resolve a single value with context substitution
  const resolveValue = (value: any): any => {
    if (typeof value === 'string') {
      // Check if it contains context references
      if (value.includes('{{')) {
        // If it's a simple {{key}} reference, return the value directly
        const simpleMatch = value.match(/^\{\{(\w+)\}\}$/);
        if (simpleMatch) {
          const contextKey = simpleMatch[1];
          const contextValue = context[contextKey];
          if (contextValue !== undefined && contextValue !== null) {
            // Return the value as-is (don't force string conversion for numbers/booleans in simple case)
            return contextValue;
          }
          // If context value is not found, return sensible defaults to prevent showing {{key}} literally
          // This happens when state hasn't initialized yet during schema switching
          if (contextKey.includes('input') || contextKey.includes('Input')) {
            return '';
          }
          // For numbers/length, return 0 if not found
          if (contextKey.includes('length') || contextKey.includes('count') || contextKey === 'display') {
            return contextKey === 'display' ? '0' : 0;
          }
          // Debug: log when context value is not found
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Context key "${contextKey}" not found. Available keys:`, Object.keys(context));
          }
          return value; // Return original if not found
        }
        
        // Replace all {{key}} or {{key.property}} references with their actual values
        let resolved = value;
        let hasReplacement = false;
        resolved = resolved.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
          // Handle nested property access like tasks.length
          const keys = path.split('.');
          let contextValue = context;
          for (const key of keys) {
            if (contextValue === undefined || contextValue === null) return match;
            contextValue = contextValue[key];
          }
          if (contextValue === undefined) return match;
          hasReplacement = true;
          // For boolean values, use them directly (not as strings) in expressions
          if (typeof contextValue === 'boolean') return contextValue;
          if (typeof contextValue === 'string') return `"${contextValue}"`;
          if (typeof contextValue === 'number') return contextValue;
          return `"${String(contextValue)}"`;
        });
        
        // If we made replacements and it looks like an expression, try to evaluate
        if (hasReplacement && (resolved.includes('?') || resolved.includes('==='))) {
          try {
            // eslint-disable-next-line no-eval
            const result = eval(resolved);
            return result;
          } catch {
            // If evaluation fails, return the string with replacements (but unquoted)
            return resolved.replace(/"/g, '');
          }
        }
        
        // If we made replacements but it's not an expression, just return unquoted
        if (hasReplacement) {
          return resolved.replace(/"/g, '');
        }
        
        return value; // No replacements made, return original
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively resolve object properties
      const resolved: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        resolved[k] = resolveValue(v);
      }
      return resolved;
    }
    return value;
  };

  // Resolve props with context substitution
  const resolveProps = (rawProps: Record<string, any>): Record<string, any> => {
    const resolved: Record<string, any> = {};
    for (const [key, value] of Object.entries(rawProps)) {
      resolved[key] = resolveValue(value);
    }
    return resolved;
  };

  const resolvedProps = resolveProps(props);

  // Handle onClick actions
  const handleClick = () => {
    if (onClick && onAction) {
      // Pass button label if available
      const buttonLabel = resolvedProps.label || (typeof resolvedProps.children === 'string' ? resolvedProps.children : null);
      // Pass all context properties (including id, taskId, etc.)
      onAction(onClick, { ...context, buttonLabel });
    }
  };

  // Handle onChange actions
  const handleChange = (value: string) => {
    if (onChange && onAction) {
      onAction(onChange, { ...context, value });
    }
  };

  // Render children recursively
  const renderChildren = () => {
    if (children.length === 0) {
      return null;
    }

    return children.map((child, index) => (
      <SchemaRenderer
        key={index}
        schema={child}
        context={context}
        onAction={onAction}
      />
    ));
  };

  // Map schema type to primitive component
  switch (type) {
    case 'Container':
      return (
        <Container {...resolvedProps}>
          {renderChildren()}
        </Container>
      );

    case 'Text':
      return (
        <Text {...resolvedProps}>
          {renderChildren()}
        </Text>
      );

    case 'Button':
      return (
        <Button {...resolvedProps} onClick={handleClick}>
          {renderChildren()}
        </Button>
      );

    case 'Grid':
      return (
        <Grid {...resolvedProps}>
          {renderChildren()}
        </Grid>
      );

    case 'Input':
      return (
        <Input
          {...resolvedProps}
          onChange={handleChange}
        />
      );

    case 'List':
      const items = context[resolvedProps.itemsKey || 'items'] || [];
      return (
        <List
          {...resolvedProps}
          items={items}
          renderItem={(item, index) => {
            if (schema.itemSchema) {
              const itemContext = { ...context, ...item, itemIndex: index };
              return (
                <SchemaRenderer
                  schema={schema.itemSchema}
                  context={itemContext}
                  onAction={onAction}
                />
              );
            }
            return null;
          }}
        />
      );

    case 'State':
      // Extract initialState from props before resolution (it's not a template)
      const initialState = props.initialState || {};
      // Create a stable key based on initialState to force remount when schema changes
      const stateKey = JSON.stringify(initialState);
      return (
        <State key={stateKey} initialState={initialState}>
          {(state: any, setState: (value: any) => void) => {
            // Ensure state is always an object
            const currentState = state || {};
            // Create new context with state - merge state into context
            // State should override context values
            const stateContext = { ...context, ...currentState, setState };
            return (
              <>
                {children.map((child, index) => (
                  <SchemaRenderer
                    key={`state-child-${index}-${stateKey}`}
                    schema={child}
                    context={stateContext}
                    onAction={(action, ctx) => {
                      // Update state if action modifies it
                      if (onAction) {
                        // Merge ctx into stateContext to ensure we have all values
                        onAction(action, { ...stateContext, ...ctx });
                      }
                    }}
                  />
                ))}
              </>
            );
          }}
        </State>
      );

    default:
      console.warn(`Unknown schema type: ${type}`);
      return null;
  }
};


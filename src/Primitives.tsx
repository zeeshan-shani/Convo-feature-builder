import React, { useState, useCallback, ReactNode } from 'react';

// Container primitive - layout with flex direction
export interface ContainerProps {
  flexDirection?: 'row' | 'column';
  gap?: number | string;
  padding?: number | string;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  flexDirection = 'column',
  gap = 0,
  padding = 0,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  style = {},
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        padding: typeof padding === 'number' ? `${padding}px` : padding,
        alignItems,
        justifyContent,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Text primitive - displays text
export interface TextProps {
  content?: string;
  fontSize?: number | string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | number;
  color?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Text: React.FC<TextProps> = ({
  content,
  fontSize = 16,
  fontWeight = 'normal',
  color = '#000',
  style = {},
  children,
}) => {
  return (
    <span
      style={{
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      {content || children}
    </span>
  );
};

// Button primitive - clickable buttons
export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  style = {},
  children,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        padding: '8px 16px',
        fontSize: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: disabled ? '#e0e0e0' : style.backgroundColor || '#6366f1',
        color: style.color || '#ffffff',
        fontWeight: '500',
        boxShadow: disabled
          ? 'none'
          : isPressed
          ? '0 2px 4px rgba(0,0,0,0.2)'
          : '0 4px 12px rgba(0,0,0,0.15)',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {label || children}
    </button>
  );
};

// Grid primitive - grid layout with configurable columns
export interface GridProps {
  columns?: number;
  gap?: number | string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  columns = 1,
  gap = 0,
  style = {},
  children,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Input primitive - text input field
export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({
  value = '',
  onChange,
  placeholder = '',
  style = {},
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      style={{
        padding: '12px 16px',
        fontSize: '16px',
        border: `2px solid ${isFocused ? '#6366f1' : '#e5e7eb'}`,
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: isFocused
          ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
          : '0 1px 3px rgba(0,0,0,0.1)',
        ...style,
      }}
    />
  );
};

// List primitive - renders items from an array
export interface ListProps {
  items?: any[];
  renderItem?: (item: any, index: number) => ReactNode;
  style?: React.CSSProperties;
}

export const List: React.FC<ListProps> = ({
  items = [],
  renderItem,
  style = {},
}) => {
  if (!renderItem) {
    return null;
  }

  return (
    <div style={style}>
      {items.map((item, index) => (
        <div
          key={item?.id || index}
          style={{
            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

// State primitive - manages local state for children
export interface StateProps {
  initialState?: any;
  children?: (state: any, setState: (value: any) => void) => ReactNode;
}

export const State: React.FC<StateProps> = ({ initialState = {}, children }) => {
  // Use a ref to track the previous initialState to detect changes
  const prevInitialStateRef = React.useRef<string>('');
  const initialStateKey = JSON.stringify(initialState);
  
  // Only reset state if initialState actually changed (not just on every render)
  const [state, setState] = useState(() => {
    prevInitialStateRef.current = initialStateKey;
    return initialState;
  });

  // Reset state when initialState changes (important for schema switching)
  React.useEffect(() => {
    if (prevInitialStateRef.current !== initialStateKey) {
      prevInitialStateRef.current = initialStateKey;
      setState(initialState);
    }
  }, [initialStateKey, initialState]);

  const handleSetState = useCallback((value: any) => {
    // If value is a function, call it with current state
    if (typeof value === 'function') {
      setState((prevState: any) => {
        const newState = value(prevState);
        return { ...prevState, ...newState };
      });
    } else {
      // Merge new state with existing state
      setState((prevState: any) => ({ ...prevState, ...value }));
    }
  }, []);

  if (typeof children === 'function') {
    // Always ensure state is an object, never null/undefined
    const safeState = state || {};
    return <>{children(safeState, handleSetState)}</>;
  }

  return <>{children}</>;
};


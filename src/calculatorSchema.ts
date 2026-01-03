import { SchemaNode } from './SchemaRenderer';

export const calculatorSchema: SchemaNode = {
  type: 'Container',
  props: {
    flexDirection: 'column',
    gap: 24,
    padding: 32,
    style: {
      maxWidth: '420px',
      margin: '0 auto',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      animation: 'scaleIn 0.4s ease-out',
    },
  },
  children: [
    // Title
    {
      type: 'Text',
      props: {
        content: 'Calculator',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        style: {
          textAlign: 'center',
          marginBottom: '8px',
        },
      },
    },
    // Display
    {
      type: 'State',
      props: {
        initialState: { display: '0' },
      },
      children: [
        {
          type: 'Container',
          props: {
            style: {
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              padding: '24px 28px',
              borderRadius: '16px',
              minHeight: '100px',
              alignItems: 'center',
              justifyContent: 'flex-end',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
          children: [
            {
              type: 'Text',
              props: {
                content: '{{display}}',
                fontSize: 42,
                fontWeight: 'bold',
                color: '#ffffff',
                style: {
                  fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '1px',
                  wordBreak: 'break-all',
                  textAlign: 'right',
                },
              },
            },
          ],
        },
        // Button grid
        {
          type: 'Grid',
          props: {
            columns: 4,
            gap: 12,
            style: {
              marginTop: '8px',
            },
          },
          children: [
            // Row 1: C, /, *, -
            {
              type: 'Button',
              props: {
                label: 'C',
                style: {
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                },
              },
              onClick: 'clear',
            },
            {
              type: 'Button',
              props: {
                label: '÷',
                style: {
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                },
              },
              onClick: 'operator',
            },
            {
              type: 'Button',
              props: {
                label: '×',
                style: {
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                },
              },
              onClick: 'operator',
            },
            {
              type: 'Button',
              props: {
                label: '−',
                style: {
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                },
              },
              onClick: 'operator',
            },
            // Row 2: 7, 8, 9, +
            {
              type: 'Button',
              props: {
                label: '7',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '8',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '9',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '+',
                style: {
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                },
              },
              onClick: 'operator',
            },
            // Row 3: 4, 5, 6, =
            {
              type: 'Button',
              props: {
                label: '4',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '5',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '6',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '=',
                style: {
                  gridRow: 'span 2',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: '700',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                },
              },
              onClick: 'equals',
            },
            // Row 4: 1, 2, 3
            {
              type: 'Button',
              props: {
                label: '1',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '2',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '3',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            // Row 5: 0, .
            {
              type: 'Button',
              props: {
                label: '0',
                style: {
                  gridColumn: 'span 2',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
            {
              type: 'Button',
              props: {
                label: '.',
                style: {
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  fontSize: '24px',
                  fontWeight: '600',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              },
              onClick: 'number',
            },
          ],
        },
      ],
    },
  ],
};

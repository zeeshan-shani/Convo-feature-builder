import { SchemaNode } from './SchemaRenderer';

export const todoSchema: SchemaNode = {
  type: 'Container',
  props: {
    flexDirection: 'column',
    gap: 24,
    padding: 32,
    style: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      animation: 'scaleIn 0.4s ease-out',
    },
  },
  children: [
    {
      type: 'Container',
      props: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        style: {
          marginBottom: '8px',
        },
      },
      children: [
        {
          type: 'Text',
          props: {
            content: '📝',
            fontSize: 32,
            style: {
              lineHeight: 1,
            },
          },
        },
        {
          type: 'Text',
          props: {
            content: 'Todo List',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#1f2937',
          },
        },
      ],
    },
    {
      type: 'State',
      props: {
        initialState: {
          tasks: [],
          inputValue: '',
        },
      },
      children: [
        // Input section
        {
          type: 'Container',
          props: {
            flexDirection: 'row',
            gap: 12,
            style: {
              marginBottom: '8px',
            },
          },
          children: [
            {
              type: 'Input',
              props: {
                value: '{{inputValue}}',
                placeholder: 'What needs to be done?',
                style: {
                  flex: 1,
                  fontSize: '16px',
                  padding: '14px 18px',
                },
              },
              onChange: 'updateInput',
            },
            {
              type: 'Button',
              props: {
                label: 'Add Task',
                style: {
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                },
              },
              onClick: 'addTask',
            },
          ],
        },
        // Task list
        {
          type: 'Container',
          props: {
            flexDirection: 'column',
            gap: 12,
            style: {
              marginTop: '16px',
            },
          },
          children: [
            {
              type: 'Container',
              props: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                style: {
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  marginBottom: '8px',
                },
              },
              children: [
                {
                  type: 'Text',
                  props: {
                    content: '{{tasks.length}}',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#6366f1',
                  },
                },
                {
                  type: 'Text',
                  props: {
                    content: '{{tasks.length}}' === '1' ? 'task' : 'tasks',
                    fontSize: 16,
                    color: '#6b7280',
                  },
                },
              ],
            },
            {
              type: 'List',
              props: {
                itemsKey: 'tasks',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                },
              },
              itemSchema: {
                type: 'Container',
                props: {
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'center',
                  style: {
                    padding: '16px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '14px',
                    backgroundColor: '{{completed}}' ? '#f9fafb' : '#ffffff',
                    boxShadow: '{{completed}}' ? '0 2px 4px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    opacity: '{{completed}}' ? 0.7 : 1,
                  },
                },
                children: [
                  {
                    type: 'Container',
                    props: {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      style: {
                        flex: 1,
                        minWidth: 0,
                      },
                    },
                    children: [
                      {
                        type: 'Text',
                        props: {
                          content: '{{completed}}' ? '✅' : '⭕',
                          fontSize: 20,
                          style: {
                            flexShrink: 0,
                          },
                        },
                      },
                      {
                        type: 'Text',
                        props: {
                          content: '{{text}}',
                          fontSize: 16,
                          fontWeight: '{{completed}}' ? 'normal' : '500',
                          color: '{{completed}}' ? '#9ca3af' : '#1f2937',
                          style: {
                            flex: 1,
                            textDecoration: '{{completed}}' ? 'line-through' : 'none',
                            wordBreak: 'break-word',
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: 'Button',
                    props: {
                      label: '{{completed}}' ? 'Undo' : 'Complete',
                      style: {
                        backgroundColor: '{{completed}}' ? '#f59e0b' : '#10b981',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '{{completed}}' ? '0 2px 8px rgba(245, 158, 11, 0.3)' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                      },
                    },
                    onClick: 'markComplete',
                  },
                  {
                    type: 'Button',
                    props: {
                      label: 'Delete',
                      style: {
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      },
                    },
                    onClick: 'deleteTask',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

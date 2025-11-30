const anamnesisDocumentJsonSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        content: { type: 'string' },
        published: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
} as const;


const anamnesisDocumentBodyJsonSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
} as const;

export { anamnesisDocumentBodyJsonSchema, anamnesisDocumentJsonSchema};
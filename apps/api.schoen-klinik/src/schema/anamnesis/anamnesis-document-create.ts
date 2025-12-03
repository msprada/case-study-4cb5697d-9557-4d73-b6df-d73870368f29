const anamnesisDocumentJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    content: { type: 'string' },
    published: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

const anamnesisDocumentBodyJsonSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'address', 'email', 'mainMedicalDisorder'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    address: { type: 'string' },
    email: { type: 'string', format: 'email' },
    mainMedicalDisorder: { type: 'string' },
    furtherMedicalDisorder: { type: 'string' },
    notes: { type: 'string' },
  },
} as const;

export { anamnesisDocumentBodyJsonSchema, anamnesisDocumentJsonSchema };

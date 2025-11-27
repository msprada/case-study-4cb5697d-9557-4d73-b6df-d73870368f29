//TODO Extend Schema and resolvers
//TODO use typeSafed types

export const schema = `
    type Query {
        hello: String,
        anamnesisDocuments:[AnamnesisDocument!]!
    }

    type Mutation {
        createAnamnesisDocument(input: CreateAnamnesisDocument!): AnamnesisDocument!
    }

    type AnamnesisDocument {
        id: ID!
        description: String!
        email: String!
    }

    input CreateAnamnesisDocument {
        description: String!
        email: String!
    }
`;

export let anamnesisDocumentSet = [
    { id: "1", description: "Husten", email: "alex@example.com" },
    { id: "2", description: "Bauchschmerzen", email: "marvin@example.com" },
    { id: "3", description: "Schulterschmerzen", email: "steward@example.com" }
];

let nextId = anamnesisDocumentSet.length+1;

export const resolvers = {
    Query: {
        hello: async () => 'Hello, Fastify with GraphQL!',
        anamnesisDocuments: async () => anamnesisDocumentSet
    },
    Mutation: {
        createAnamnesisDocument: async (parent:any, args:any, context:any) => {
            const { input } = args;
            context.app.log.info('Creating new anamnesis document', input);

            const anamnesisDocument = {
                id: nextId.toString(),
                ...input
            };

            anamnesisDocumentSet.push(anamnesisDocument);
            nextId++;

            return anamnesisDocument;
        }
    },
};
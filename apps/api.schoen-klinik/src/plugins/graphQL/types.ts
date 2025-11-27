//TODO Extend Schema and resolvers
//TODO use typeSafed types

import { gql } from "mercurius-codegen";
import { type IResolvers, type MercuriusContext } from 'mercurius'
import type { MutationcreateAnamnesisDocumentArgs } from "./generated.js";


export const schema = gql`
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

export const resolvers:IResolvers = {
    Query: {
        hello: async () => 'Hello, Fastify with GraphQL!',
        anamnesisDocuments: async () => anamnesisDocumentSet
    },
    Mutation: {
        createAnamnesisDocument: async (parent:{}, args:MutationcreateAnamnesisDocumentArgs, context:MercuriusContext) => {
            const { input } = args;
            context.app.log.info('Creating new anamnesis document');

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
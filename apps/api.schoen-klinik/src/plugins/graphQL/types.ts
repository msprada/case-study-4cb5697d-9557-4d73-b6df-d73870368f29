//TODO Extend Schema and resolvers

import { gql } from "mercurius-codegen";
import { type IResolvers, type MercuriusContext } from 'mercurius'
import type { MutationcreateAnamnesisDocumentArgs } from "./generated-files/generated.js";
import type { FastifyInstance } from "fastify";


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

let nextId = anamnesisDocumentSet.length + 1;

export const resolvers: IResolvers = {
    Query: {
        hello: async () => 'Hello, Fastify with GraphQL!',
        anamnesisDocuments: async () => anamnesisDocumentSet
    },
    Mutation: {
        createAnamnesisDocument: async (parent: {}, args: MutationcreateAnamnesisDocumentArgs, context: MercuriusContext) => {
            const fastify = context.app as FastifyInstance;
            const prisma = fastify.prisma;
            const { input } = args;

            //TODO: Persist  to DB using Prisma
             const anamnesisDocument = {
                id: nextId.toString(),
                ...input
            };

            await prisma.anamnesisDocument.create({
                data:{...anamnesisDocument}
            });
            

           
            context.app.log.info('Creating new anamnesis document');

            
            anamnesisDocumentSet.push(anamnesisDocument);
            nextId++;

            return anamnesisDocument;
        }
    },
};
//TODO Extend Schema and resolvers

import { gql } from "mercurius-codegen";
import { GraphQLError } from "graphql";
import { type IResolvers, type MercuriusContext } from 'mercurius'
import type { MutationcreateAnamnesisDocumentArgs } from "./generated-files/generated.js";
import type { FastifyInstance } from "fastify";
import { PrismaClient } from "../database/prisma/generated/prisma/client.js";


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
            const prisma = fastify.prisma as PrismaClient;
            const { input } = args;

            try {
                 const created = await prisma.anamnesisDocument.create({
                    data: {
                        ...input
                    }
                });

                context.app.log.info('Creating new anamnesis document');
                return created;
            }
            catch (error:unknown) {

                switch (true) {
                    case error instanceof Error && error.message.includes('validation'):
                        context.app.log.error(`Failed to create anamnesis document: ${error.message}`);
                        throw new GraphQLError('Invalid input data', {
                            extensions: { code: 'BAD_USER_INPUT' }
                        });
                    default: {
                        context.app.log.error(`Failed to create anamnesis document resulting following: ${String(error)}`);
                          throw new GraphQLError('Failed to create anamnesis document', {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' }
                        });
                    }
                }
                
            }    
        }
    },
};
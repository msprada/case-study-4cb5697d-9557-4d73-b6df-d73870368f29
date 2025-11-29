//TODO Extend Schema and resolvers

import { gql } from "mercurius-codegen";
import { GraphQLError } from "graphql";
import { type IResolvers, type MercuriusContext } from 'mercurius'
import type { MutationcreateAnamnesisDocumentArgs } from "./generated-files/generated.js";
import type { FastifyInstance } from "fastify";
import { PrismaClient, Prisma } from "../database/prisma/generated/prisma/client.js";


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

export const resolvers: IResolvers = {
    Query: {
        hello: async () => `Hello, Fastify with GraphQL. I'm alive!`,
        anamnesisDocuments: async (
            parent: {},
            args: {},
            context: MercuriusContext
        ): Promise<Array<{ id: string; description: string; email: string }>> => {
            const fastify = context.app as FastifyInstance;
            const prisma = fastify.prisma as PrismaClient;

            try {
                const resultSet = await prisma.anamnesisDocument.findMany();
                return resultSet.length ? resultSet : []

            }
            catch (error: unknown) {

                switch (true) {
                    case error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025':
                        context.app.log.error(`Document not found: ${error.message}`);
                        throw new GraphQLError('Document not found', {
                            extensions: { code: 'NOT_FOUND' }
                        });

                    case error instanceof Error: {
                        context.app.log.error(`Failed to receive data: ${error.message}`);
                        throw new GraphQLError('Could not read data from db.', {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' }
                        });
                    }

                    default:
                        throw new GraphQLError('Could not read data from db.', {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' }
                        });
                }
            }

        }
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
            catch (error: unknown) {

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
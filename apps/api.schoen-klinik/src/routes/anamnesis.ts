import {
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import { type FromSchema } from 'json-schema-to-ts';
import {
  anamnesisDocumentBodyJsonSchema,
  anamnesisDocumentJsonSchema,
} from '../schema/anamnesis/anamnesis-document-create.js';

async function anamnesisRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{ Body: FromSchema<typeof anamnesisDocumentBodyJsonSchema> }>(
    '/',
    {
      schema: {
        body: anamnesisDocumentBodyJsonSchema,
        response: {
          201: anamnesisDocumentJsonSchema,
        } as const,
      },
    },
    async (request, reply) => {
      try {
        const {
          firstname,
          lastname,
          address,
          email,
          mainMedicalDisorder,
          furtherMedicalDisorder,
          notes,
        } = request.body;

        console.log({ body: request.body });

        if (!email) {
          reply.code(400).send({ error: 'Email is required' });
          return;
        }

        const newAnamnesisDocument = await fastify.prisma.anamnesisDocument.create({
          data: {
            mainMedicalDisorder: mainMedicalDisorder,
            furtherMedicalDisorder: furtherMedicalDisorder,
            notes: notes,
            email: email,
          },
        });
        reply.code(201).send(newAnamnesisDocument);
      } catch (error) {
        if (error instanceof Error) {
          request.log.error(`Error creating anamnesisDocument: ${error.message}`);
        }

        reply.code(500).send({ error: 'Failed to create anamnesisDocument' });
      }
    },
  );
}

export default anamnesisRoutes;

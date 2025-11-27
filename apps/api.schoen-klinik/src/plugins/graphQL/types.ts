//TODO Extend Schema and resolvers

export const schema = `
  type Query {
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!'
  }
};
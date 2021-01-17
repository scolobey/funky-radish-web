// src/schema.js

import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

const typeDefs = `
  type Recipe {
   id: ID!
   title: String
  }

  type Query {
    recipes: [Recipe]
  }
`;

const schema = makeExecutableSchema({ typeDefs });
export { schema };

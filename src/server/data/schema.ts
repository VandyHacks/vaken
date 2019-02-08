import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }
`;

const posts = [
	{ authorId: 1, id: 1, title: 'Introduction to GraphQL', votes: 2 },
	{ authorId: 2, id: 2, title: 'Welcome to Meteor', votes: 3 },
	{ authorId: 2, id: 3, title: 'Advanced GraphQL', votes: 1 },
	{ authorId: 3, id: 4, title: 'Launchpad is Cool', votes: 7 },
];

const resolvers = {
	Query: {
		posts: () => posts,
	},
};

export const schema = makeExecutableSchema({
	resolvers,
	typeDefs,
});

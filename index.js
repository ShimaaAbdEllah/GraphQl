const { ApolloServer, gql } = require("apollo-server");
const fetch = require("node-fetch");

const typeDefs = gql`
  type Comment {
    id: Int
    postId: Int
    name: String
    email: String
    body: String
  }

  type Post {
    id: Int
    title: String
    body: String
    comments: [Comment]
  }

  type Query {
    posts: [Post]
    comment(commentId: Int!): Comment
  }

  type Mutation {
    createComment(data: CreateCommentInput!): Comment
  }

  input CreateCommentInput {
    postId: Int!
    name: String!
    email: String!
    body: String!
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      posts: async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com//posts");
        return response.json();
      },
      comment: async (_, { commentId }) => {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com//comments/${commentId}`
        );
        return response.json();
      },
    },
    Mutation: {
      createComment: async (_, { data }) => {
        const { postId, name, email, body } = data;
        const response = await fetch(`https://jsonplaceholder.typicode.com//posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, name, email, body }),
        });
        return response.json();
      },
    },
  },
});

server.listen(3001).then(() => {
  console.log("Server listening on port 3001");
});

const { gql } = require('apollo-server');

const typeDefs = gql`
  type Vocab {
    keyword: String
    shortDef: String
    cambridgeDef: String
    yahooDef: String
    englishDef: String
    isAdded: Boolean!
  }
  
  type User {
    id: ID!
    email: String!
    favorites: [Vocab]
  }

  type Query {
    me: User
    vocabs: [Vocab]
    vocab(keyword: String!): Vocab
  }
  
  type Mutation {
    login(email: String): String # login token
    addFavorite(keyword: String!): FavoriteUpdateResponse!
    removeFavorite(keyword: String!): FavoriteUpdateResponse!
  }
  
  type FavoriteUpdateResponse {
    success: Boolean!
    keyword: String
    vocab: Vocab
  }
`;

module.exports = typeDefs;

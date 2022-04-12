const fs = require('fs')
const path = require('path')
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const express = require('express');
const resolvers = require('./resolvers')

// chargement du schéma
const typeDefs = fs.readFileSync(path.join(__dirname, 'model.graphql'), { encoding: 'utf-8' })

// définition du serveur
// const server = new ApolloServer({ typeDefs, resolvers, playground: false });
async function start() {
  const app = express()
  const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ playground: false })] });
  await server.start()
  server.applyMiddleware({ app })
  // lancement du serveur

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

start();

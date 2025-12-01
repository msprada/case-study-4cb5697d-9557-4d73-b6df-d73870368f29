# Getting Started with [Fastify](https://fastify.dev)

## Available Scripts

In the project directory, you can run:

### `pnpm run dev`

To start the app in dev/ watch mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `pnpm run start`

For production mode

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## Mercurius -  graphQL Plugin For Fastify [mercurius](https://mercurius.dev)

- for detailed manual check out the current documentation 


### Example graphQL Statements

```
# Query Anamnesis Documtens

```
anamnesisDocuments
```
# Add new Anamnesis Document

mutation {
  createAnamnesisDocument(input: {
    mainMedicalDisorder: "Brustschmerzen",
    email: "sarah@example.com"
  }) {
    id
    mainMedicalDisorder
    email
  }
}
```



### UI - Dev Mode

- the plugin provides a graphical user interface for debugging your queries
- the endpoint is "/graphiql"

### GrapphQL Resolver

- the plugin provides some endpoints where you can process graphQL Queries, Mutation, etc
- the route is /graphql
- the body should contain the query in following way

```
{"query": "query { hello }"}'
```
- You can use curl to easily test this endpoint
e.g. 
```
curl -H "Content-Type:application/json" -XPOST -d '{"query": "query { hello }"}' PROTOCOLL://DOMAIN:PORT/graphql
```

```
#dev environment

curl -H "Content-Type:application/json" -XPOST -d '{"query": "query { hello }"}' http://localhost:3000/graphql
```

## REST API 
- additional to an graphQL there is also a REST API

### Endpoints

#### Ressource - Anamnesis Document

##### Create Document

```
curl -H "Content-Type:application/json" -XPOST -d '{"title": "TestTitle", "content":"Test Content", "email": "test@mail.com"}' http://localhost:3000/api/anamnesis
```






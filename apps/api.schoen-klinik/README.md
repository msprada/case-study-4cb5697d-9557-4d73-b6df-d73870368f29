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


### UI - Dev Mode

- the plugin provides a graphical user interface for debugging your queries
- the endpoint is "/graphiql"

### Endpoints

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




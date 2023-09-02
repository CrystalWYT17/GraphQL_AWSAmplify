const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./server/schema/schema");
const testSchema = require("./server/schema/types_schema");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

console.log("user ", process.env.mongoUsername);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUsername}:${process.env.mongoUserPassword}@graphqlcluster.vhhygv4.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&&maxIdleTimeMS=12000`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen({ port: port }, () => {
      console.log(process.env.mongoUsername);
      console.log("listening request on port 8080");
    });
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

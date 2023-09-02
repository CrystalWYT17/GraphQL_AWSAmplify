const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./server/schema/schema");
const testSchema = require("./server/schema/types_schema");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

console.log("user ", process.env.DATABASE_URL);

const url = process.env.DATABASE_URL;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen({ port: port }, () => {
      console.log("listening request on port 4000");
    });
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

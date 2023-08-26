const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
} = graphql;

// Scalar Type
/*
String = GraphQLString
int
float
boolean
ID
*/

const Person = new GraphQLObjectType({
  name: "Person",
  description: "Represents a Person Type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },

    // custom any OBJECT type
    justAType: {
      type: Person,
      resolve(parent, args) {
        return parent;
      },
    },
  }),
});

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    person: {
      type: Person,

      resolve(parent, args) {
        let personObj = {
          // id: {type: GraphQLID}
          name: "WYT",
          age: 23,
          isMarried: false,
          gpa: 4.59,
        };
        return personObj;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

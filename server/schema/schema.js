const graphql = require("graphql");
var lodash = require("lodash");

const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

//dummy data
// var userData = [
//   { id: "1", name: "Gally", age: 35, profession: "Software Engineer" },
//   { id: "2", name: "Anna", age: 28, profession: "Programmer" },
//   { id: "3", name: "Bella", age: 18, profession: "Tester" },
//   { id: "4", name: "Kristina", age: 24, profession: "System Analystic" },
//   { id: "5", name: "Jennifer", age: 40, profession: "Project Manager" },
// ];

// var hobbiesData = [
//   {
//     id: "1",
//     title: "Programming",
//     description: "Something about programming.......",
//     userId: "1",
//   },
//   { id: "2", title: "Swimming", description: "Let's go swimming", userId: "1" },
//   { id: "3", title: "Hiking", description: "Hiking is too hard", userId: "2" },
//   {
//     id: "4",
//     title: "Cycling",
//     description: "Cycling? Be careful",
//     userId: "3",
//   },
// ];

// var postData = [
//   { id: "1", comment: "Post something", userId: "1" },
//   { id: "2", comment: "GraphQL is amazing", userId: "1" },
//   { id: "3", comment: "Let's do something else", userId: "3" },
//   { id: "4", comment: "Let's do something", userId: "5" },
// ];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
        // return lodash.filter(postData, { userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
        // return lodash.filter(hobbiesData, { userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby description",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return lodash.find(userData, { id: parent.userId });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "PostComment",
  description: "Post a comment",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return lodash.find(userData, { id: parent.userId });
      },
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description for root query",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        // resolve with data
        // get and return from data source

        // let user = {
        //   id: "345",
        //   name: "john",
        //   age: 34,
        // };
        // return user;

        // return lodash.find(userData, { id: args.id });
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return userData;
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return lodash.find(hobbiesData, { id: args.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData;
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return lodash.find(postData, { id: args.id });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postData;
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: {type: GraphQLID}
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        // let user = {
        //   name: args.name,
        //   age: args.age,
        //   profession: args.profession,
        // };
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    createPost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID}
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        // id: {type: GraphQLID}
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true } //send the update object
        ));
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },
    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },
    removeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();
        if (!removedUser) {
          throw new "Error happened"();
        }
        return removedUser;
      },
    },
    removePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();
        if (!removedPost) {
          throw new "Error happened at post"();
        }
        return removedPost;
      },
    },
    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!removedHobby) {
          throw new "Error at remove hobby"();
        }
        return removedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

/*
{
  user(id: "1"){
    name
  }
}
*/

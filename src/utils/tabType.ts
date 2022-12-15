import graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;

import { SingleTabDataBasic } from "../../client/src/utils/interfaces";

export interface TabDatabase_i extends SingleTabDataBasic {
  id: string;
  userId: string;
}

export const TabFields = {
  id: { type: GraphQLID },
  userId: { type: GraphQLID },
  title: { type: GraphQLString },
  color: { type: GraphQLString },
  column: { type: GraphQLInt },
  priority: { type: GraphQLInt },
  openedByDefault: { type: GraphQLBoolean },
  deletable: { type: GraphQLBoolean },
  type: { type: GraphQLString },
  noteInput: { type: GraphQLString },
  rssLink: { type: GraphQLString },
  date: { type: GraphQLBoolean },
  description: { type: GraphQLBoolean },
  itemsPerPage: { type: GraphQLInt },
};

export const TabType = new GraphQLObjectType({
  name: "Tab",
  fields: () => ({
    ...TabFields,
  }),
});

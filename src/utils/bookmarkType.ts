import graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = graphql;

import { SingleBookmarkDataBasic } from "../../client/src/utils/interfaces";

export interface BookmarkLocal_i extends SingleBookmarkDataBasic {
  tagIndices: number[];
}

export interface BookmarkDatabase_i extends SingleBookmarkDataBasic {
  id: string;
  userId: string;
  tags: string[];
}

export const BookmarkFields = {
  id: { type: GraphQLID },
  userId: { type: GraphQLID },
  title: { type: GraphQLString },
  URL: { type: GraphQLString },
  tags: { type: new GraphQLList(GraphQLID) },
  defaultFaviconFallback: { type: GraphQLBoolean },
};

export const BookmarkType = new GraphQLObjectType({
  name: "Bookmark",
  fields: () => ({
    ...BookmarkFields,
  }),
});

import { GraphQLString, GraphQLObjectType } from "graphql";

export interface ChangeUserByUser_i {
  id: string;
  name: string | null;
  email: string | null;
  passwordCurrent: string;
}

export const ChangeUserByUserField = {
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  error: { type: GraphQLString },
};

export const ChangeUserByUserType = new GraphQLObjectType({
  name: "ChangeUserByUser",
  fields: () => ({
    ...ChangeUserByUserField,
  }),
});

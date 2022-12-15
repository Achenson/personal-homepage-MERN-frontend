import { GraphQLString, GraphQLObjectType, GraphQLID } from "graphql";

export interface ChangePasswordByUser_i {
  id: string;
  passwordCurrent: string;
  passwordNew: string;
}

export const ChangePasswordByUserField = {
  name: { type: GraphQLString },
  error: { type: GraphQLString },
};

export const ChangePasswordByUserType = new GraphQLObjectType({
  name: "ChangePasswordByUser",
  fields: () => ({
    ...ChangePasswordByUserField,
  }),
});

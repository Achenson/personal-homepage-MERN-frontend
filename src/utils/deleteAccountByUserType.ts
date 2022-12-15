import { GraphQLString, GraphQLObjectType } from "graphql";

export interface DeleteAccountByUser_i {
  id: string;
  password: string;
}

export const DeleteAccountByUserField = {
  name: { type: GraphQLString },
  error: { type: GraphQLString },
};

export const DeleteAccountByUserType = new GraphQLObjectType({
  name: "DeleteAccount",
  fields: () => ({
    ...DeleteAccountByUserField,
  }),
});

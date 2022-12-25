import React, { useMemo } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import { createClient, Provider, dedupExchange, cacheExchange } from "urql";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { QueryClientProvider, QueryClient } from "react-query";
import { authExchange } from "@urql/exchange-auth";
import { makeOperation } from "@urql/core";
import jwtDecode from "jwt-decode";
import axios from "axios";

import MainWrapper from "./components/MainWrapper";

import { useAuth } from "./state/hooks/useAuth";

interface AuthState {
  accessToken: string | null;
}
interface AuthToOperation {
  authState: AuthState;
  operation: any;
}

const environment = process.env.NODE_ENV;

let graphqlUri: string;

if (environment === "production") {
  // graphqlUri = "https://smoothtabs-api.onrender.com/graphql";
  graphqlUri = "/graphql";
} else {
  graphqlUri = "http://localhost:4000/graphql";
}

let refreshTokenUri: string;

if (environment === "production") {
  // refreshTokenUri = "https://smoothtabs-api.onrender.com/refresh_token";
  refreshTokenUri = "/refresh_token";
} else {
  refreshTokenUri = "http://localhost:4000/refresh_token";
}

const queryClient = new QueryClient();

function App() {
  const authContext = useAuth();
  const loginAttempt = useAuth((store) => store.loginAttempt);

  const client = useMemo(() => {
    return createClient({
      url: graphqlUri,
      exchanges: [
        dedupExchange,
        cacheExchange,
        authExchange({
          addAuthToOperation: ({ authState, operation }: AuthToOperation) => {
            //if the token isn't in the auth state, return the operation without changes
            if (!authState || !authState.accessToken) {
              console.log("urql RETURN empty OPERATION");
              return operation;
            }

            console.log("urql RETURN HEADERS with Authorization");

            const fetchOptions =
              typeof operation.context.fetchOptions === "function"
                ? operation.context.fetchOptions()
                : operation.context.fetchOptions || {};

            return makeOperation(operation.kind, operation, {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  Authorization: `Bearer ${authState.accessToken}`,
                },
              },
            });
          },
          didAuthError: ({ error }) => {
            // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
            console.log("did auth error");

            return error.graphQLErrors.some(
              // e => e.extensions?.code === 'FORBIDDEN',
              (e) => e.message === "Auth error"
            );
          },
          getAuth: async ({ authState, mutate }) => {
            // for initial launch, fetch the auth state from central state (zustand)
            // "We check that the authState doesn't already exist (this indicates that it is the first time
            // this exchange is executed and not an auth failure) "
            console.log("getAuth runs");

            if (!authState) {
              console.log("no auth state - initial app run");

              const accessToken = authContext.accessToken;

              if (accessToken && authContext.isAuthenticated) {
                // code executed after login. Also, later on app reload
                // (after the code for no access token runs first)

                // ====== checking if accessToken is expired
                console.log("accessToken present");

                try {
                  // @ts-ignore
                  const { exp } = jwtDecode(accessToken);
                  // accessToken shouldn't expire as this code should be executed
                  // right after access token creation, but in thery it is possible
                  if (Date.now() >= exp * 1000) {
                    console.log("refresh token - access token expired");
                    return refreshToken();
                  } else {
                    console.log("accessToken standard return");
                    return { accessToken };
                  }
                } catch {
                  console.log("refresh token after catching error");
                  return refreshToken();
                }
              }
              // code executed immediately on app reload
              console.log("no access token");
              return refreshToken();
            }
            // code executed when an auth erros has occured (meaning: accessToken has expired)

            /**
             * the following code gets executed when an auth error has occurred
             * (in case the authState is true but an error occurred in didAuthError)
             * we should refresh the token if possible and return a new auth state
             * If refresh fails, we should log out
             **/

            console.log("refresh token after auth error");
            return refreshToken();
          },
        }),
        // fetchExchange,
        multipartFetchExchange,
      ],
      fetchOptions: {
        // !!!! whitout this line cookie will not be set clientside
        credentials: "include",
      },
    });

    // async function refreshToken() {
    //   return fetch(`${refreshTokenUri}`, {
    //     method: "POST",
    //     credentials: "include",
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       console.log("refreshToken run");
    //       console.log(res);
    //       // this is also a logout logic if it fails
    //       loginAttempt(res.ok, res.userId, res.accessToken);

    //       if (!res.accessToken) {
    //         return null;
    //       }

    //       return { accessToken: res.accessToken as string };
    //     })
    //     .catch((err) => {
    //       console.log("refresh token error");
    //       console.log(err);
    //       return null;
    //     });
    // }

    async function refreshToken() {
      // return fetch(`${refreshTokenUri}`, {
      //   method: "POST",
      //   credentials: "include",
      // })
      //   .then((res) => res.json())

      return (
        axios
          .post(`${refreshTokenUri}`, null, {
            withCredentials: true,
          })
          // @ts-ignore
          // .then((res) => res.json())
          .then((res) => {
            console.log("refreshToken run");
            console.log(res);
            // this is also a logout logic if it fails
         
            loginAttempt(res.data.ok, res.data.userId, res.data.accessToken);
            
            if (!res.data.accessToken) {
              return null;
            }
            
            return { accessToken: res.data.accessToken as string };
          })
          .catch((err) => {
            console.log("refresh token error");
            console.log(err);
            return null;
          })
      );
    }
  }, [authContext.isAuthenticated, authContext.accessToken, loginAttempt]);

  /*  if (!client) {
    console.log("no client");
    return null;
  }
 */

  return (
    <Provider value={client}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          {/* <DndProvider backend={HTML5Backend}> */}
          <DndProvider options={HTML5toTouch}>
            <MainWrapper />
          </DndProvider>
        </div>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

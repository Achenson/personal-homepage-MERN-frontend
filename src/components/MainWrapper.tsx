import React from "react";
import { useQuery } from "urql";
import shallow from "zustand/shallow";

import Main from "./Main";

import {
  TabsQuery,
  BookmarksQuery,
  SettingsQuery,
} from "../graphql/graphqlQueries";

import { useAuth } from "../state/hooks/useAuth";
import { useGlobalSettings } from "../state/hooks/defaultSettingsHooks";

import { GlobalSettingsState } from "../utils/interfaces";

// component purpose: to provide globalSetting as a prop, because
// in Main a useEffect depends on it - globalSettins needs to be defined right away
function MainWrapper(): JSX.Element {
  const authContext = useAuth();
  const globalSettingsNotAuth = useGlobalSettings((state) => state, shallow);

  let userIdOrNoId: string | null;

  userIdOrNoId =
    authContext.isAuthenticated && authContext.authenticatedUserId
      ? authContext.authenticatedUserId
      : null;

  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
  });

  const [tabResults, reexecuteTabs] = useQuery({
    query: TabsQuery,
    // variables: { userId: authContext.isAuthenticated ? authContext.authenticatedUserId : testUserId },
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_tabs,
    fetching: fetching_tabs,
    error: error_tabs,
  } = tabResults;

  const [bookmarkResults, reexecuteBookmarks] = useQuery({
    query: BookmarksQuery,
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_bookmarks,
    fetching: fetching_bookmarks,
    error: error_bookmarks,
    // stale: stale_bookmarks,
  } = bookmarkResults;

  const { data, fetching, error } = settingsResults;

  if (fetching_tabs) return <p>Loading...</p>;
  if (error_tabs) return <p>Oh no... {error_tabs.message}</p>;
  // crucial for zustand db to work
  if (!data_tabs?.tabs && userIdOrNoId) return <p>Loading...</p>;

  if (fetching_bookmarks) return <p>Loading...</p>;
  if (error_bookmarks) return <p>Oh no... {error_bookmarks.message}</p>;
  if (!data_bookmarks?.bookmarks && userIdOrNoId) return <p>Loading...</p>;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  let globalSettings: GlobalSettingsState;
  globalSettings = userIdOrNoId ? data.settings : globalSettingsNotAuth;

  return (
    <Main
      globalSettings={globalSettings}
      tabsDb={userIdOrNoId ? data_tabs.tabs : null}
      bookmarksDb={userIdOrNoId ? data_bookmarks.bookmarks : null}
      reexecuteBookmarks={reexecuteBookmarks}
    />
  );
}

export default MainWrapper;

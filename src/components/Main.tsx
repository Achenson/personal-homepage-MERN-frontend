import React, { useState, useReducer, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "urql";

import AuthOuterComponent from "./AuthRoutes/AuthOuterComponent";
import LoginRegister from "../components/AuthRoutes/LoginRegister";
import PublicRoute from "./AuthRoutes/PublicRoute";
import PrivateRoute from "./AuthRoutes/PrivateRoute";
import MainRoute from "./MainRoute";
import UserProfile from "./AuthRoutes/UserProfile";
import PasswordForgotten from "./AuthRoutes/PasswordForgotten";
import ForgottenPassChange from "./AuthRoutes/ForgottenPassChange";

import { BackgroundImgQuery } from "../graphql/graphqlQueries";

import { initUpperVisState } from "../context/upperVisInitState";
import { upperVisReducer } from "../context/upperVisReducer";
import { UpperUiContext } from "../context/upperUiContext";
import { useAuth } from "../state/hooks/useAuth";
import { useTabsDb } from "../state/hooks/useTabsDb";
import { useBookmarksDb } from "../state/hooks/useBookmarksDb";

import { useWindowSize } from "../utils/funcs and hooks/useWindowSize";

import { GlobalSettingsState } from "../utils/interfaces";
import { BookmarkDatabase_i } from "../utils/bookmarkType";
import { TabDatabase_i } from "../utils/tabType";

interface Props {
  globalSettings: GlobalSettingsState;
  tabsDb: TabDatabase_i[] | null;
  bookmarksDb: BookmarkDatabase_i[] | null;
  reexecuteBookmarks: (opts?: Partial<any> | undefined) => void;
}

function Main({
  globalSettings,
  tabsDb,
  bookmarksDb,
  reexecuteBookmarks,
}: Props): JSX.Element {
  const authContext = useAuth();
  const updateTabsDb = useTabsDb((store) => store.updateTabsDb);
  const updateBookmarksDb = useBookmarksDb((store) => store.updateBookmarksDb);
  const updateReexecuteBookmarks = useBookmarksDb(
    (store) => store.updateReexecuteBookmarks
  );

  let userIdOrNoId: string | null;
  userIdOrNoId =
    authContext.authenticatedUserId && authContext.isAuthenticated
      ? authContext.authenticatedUserId
      : null;

  const [upperVisState, upperVisDispatch] = useReducer(
    upperVisReducer,
    initUpperVisState
  );

  let upperUiValue = { upperVisState, upperVisDispatch };

  const [tabType, setTabType] = useState<"folder" | "note" | "rss">("folder");
  const [paddingRight, setPaddingRight] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < 505) {
        upperVisDispatch({ type: "XS_SIZING_TRUE" });
      } else {
        upperVisDispatch({ type: "XS_SIZING_FALSE" });
      }
    }
  }, [windowSize.width]);

  /* for plain color background mode only!
 for image background mode scrollbar is visible but disabled with react-remove-scroll 
 to prevent background image flickering
 */
  const [scrollbarWidth, setScrollbarWidth] = useState(
    //  () => (windowSize.width as number) >= 400 ? 17 : 0
    0
  );

  useEffect(() => {
    if (document.body.style.overflow === "visible") {
      setScrollbarWidth(
        window.innerWidth - document.documentElement.clientWidth
      );
    }
  }, [
    setScrollbarWidth,
    // document.body.style.overflow,
    // window.innerWidth,
    // document.documentElement.clientWidth,
  ]);

  useEffect(() => {
    if (
      upperVisState.colorsSettingsVis ||
      upperVisState.backgroundSettingsVis ||
      upperVisState.settingsVis ||
      upperVisState.newBookmarkVis ||
      upperVisState.newTabVis
    ) {
      if (
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight
      ) {
        if (!globalSettings.picBackground) {
          document.body.style.overflow = "hidden";
        } else {
          // for correct display after toggling pic background
          document.body.style.overflow = "visible";
        }
        setPaddingRight(true);
      }
      return;
    }

    document.body.style.overflow = "visible";

    setPaddingRight(false);
  }, [
    upperVisState.colorsSettingsVis,
    upperVisState.backgroundSettingsVis,
    upperVisState.settingsVis,
    upperVisState.newBookmarkVis,
    upperVisState.newTabVis,
    // document.body.style.overflow,
    // document.documentElement.clientHeight,
    // document.documentElement.scrollHeight,
    globalSettings.picBackground,
  ]);

  const [backgroundImgResults, reexecuteBackgroundImg] = useQuery({
    query: BackgroundImgQuery,
    // variables: { userId: authContext.isAuthenticated ? authContext.authenticatedUserId : testUserId },
    variables: { userId: userIdOrNoId },
    pause: !userIdOrNoId,
    // requestPolicy: 'cache-and-network',
  });

  const {
    data: data_backgroundImg,
    fetching: fetching_backgroundImg,
    error: error_backgroundImg,
  } = backgroundImgResults;

  // something has to be assigned, otherwise -> ts error in MainRoute component
  let backgroundImgUrl: string | null = null;
  
  console.log("data_backgroundImg");
  console.log(data_backgroundImg);

  if (data_backgroundImg) {
    
    backgroundImgUrl = data_backgroundImg?.backgroundImg?.backgroundImgUrl;
  }

  useEffect(() => {
    if (tabsDb && userIdOrNoId) {
      updateTabsDb(tabsDb);
    }
  }, [tabsDb, userIdOrNoId, updateTabsDb]);

  useEffect(() => {
    if (bookmarksDb && userIdOrNoId) {
      updateBookmarksDb(bookmarksDb);
      updateReexecuteBookmarks(reexecuteBookmarks);
    }
  }, [
    bookmarksDb,
    userIdOrNoId,
    updateBookmarksDb,
    updateReexecuteBookmarks,
    reexecuteBookmarks,
  ]);

  let paddingProps = {
    mainPaddingRight: paddingRight,
    scrollbarWidth,
  };

  return (
    <UpperUiContext.Provider value={upperUiValue}>
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainRoute
                backgroundImgUrl={backgroundImgUrl}
                backgroundImgResults={backgroundImgResults}
                globalSettings={globalSettings}
                paddingRight={paddingRight}
                setTabType={setTabType}
                tabType={tabType}
                reexecuteBackgroundImg={reexecuteBackgroundImg}
                upperVisState={upperVisState}
                userIdOrNoId={userIdOrNoId}
                {...paddingProps}
              />
            }
          />
          <Route
            path="/login-register"
            element={
              // not possible to access if logged in!
              <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                <AuthOuterComponent
                  globalSettings={globalSettings}
                  {...paddingProps}
                >
                  <LoginRegister
                    globalSettings={globalSettings}
                    {...paddingProps}
                  />
                </AuthOuterComponent>
              </PublicRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              // not possible to access if logged in!
              <PrivateRoute isAuthenticated={authContext.isAuthenticated}>
                <AuthOuterComponent
                  globalSettings={globalSettings}
                  {...paddingProps}
                >
                  <UserProfile
                    globalSettings={globalSettings}
                    {...paddingProps}
                  />
                </AuthOuterComponent>
              </PrivateRoute>
            }
          />
          <Route
            path="/passforgot"
            element={
              // not possible to access if logged in!
              <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                <AuthOuterComponent
                  globalSettings={globalSettings}
                  {...paddingProps}
                >
                  <PasswordForgotten
                    globalSettings={globalSettings}
                    {...paddingProps}
                  />
                </AuthOuterComponent>
              </PublicRoute>
            }
          />

          <Route
            path="/passforgot-change/:token"
            element={
              // not possible to access if logged in!
              <PublicRoute isAuthenticated={authContext.isAuthenticated}>
                <AuthOuterComponent
                  globalSettings={globalSettings}
                  {...paddingProps}
                >
                  <ForgottenPassChange
                    globalSettings={globalSettings}
                    {...paddingProps}
                  />
                </AuthOuterComponent>
              </PublicRoute>
            }
          />
        </Routes>
      </HashRouter>
    </UpperUiContext.Provider>
  );
}

export default Main;

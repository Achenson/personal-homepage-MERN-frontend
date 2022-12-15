import React from "react";
import { useMutation } from "urql";

import Bookmark_newAndEdit from "../Shared/Bookmark_newAndEdit";

import { ReactComponent as PencilSmallSVG } from "../../svgs/pencilSmall.svg";
import { ReactComponent as TrashSmallSVG } from "../../svgs/trashSmall.svg";
import { ReactComponent as GlobeSVG } from "../../svgs/internet-web-browser-conv.svg";

import {
  ChangeBookmarkMutation,
  DeleteBookmarkMutation,
  DeleteTabMutation,
} from "../../graphql/graphqlMutations";

import { useAuth } from "../../state/hooks/useAuth";
import { useTabContext } from "../../context/tabContext";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import {
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../utils/bookmarkType";
import { TabDatabase_i } from "../../utils/tabType";

interface Props {
  singleBookmarkData: SingleBookmarkData | BookmarkDatabase_i;
  bookmarkId: string;
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>;
  colNumber: number;
  tabID: string;
  isTabDraggedOver: boolean;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
  tabOpened: boolean;
}

interface BookmarkId {
  id: string;
}

interface TabId {
  id: string;
}

function SingleBookmark({
  singleBookmarkData,
  bookmarkId,
  setBookmarkId,
  colNumber,
  isTabDraggedOver,
  globalSettings,
  userIdOrNoId,
  tabOpened,
}: Props): JSX.Element {
  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const editBookmarkNotAuth = useBookmarks((store) => store.editBookmark);

  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as BookmarkDatabase_i[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const authContext = useAuth();
  const tabContext = useTabContext();
  const setFocusedTabState = useTabs((store) => store.setFocusedTabState);
  const upperUiContext = useUpperUiContext();
  const deleteBookmarkNotAuth = useBookmarks((store) => store.deleteBookmark);
  const deleteTabNotAuth = useTabs((store) => store.deleteTab);
  const getTabsToDelete = useBookmarks((store) => store.getTabsToDelete);

  const [deleteBookmarkResult, deleteBookmark] = useMutation<any, BookmarkId>(
    DeleteBookmarkMutation
  );

  const [changeBookmarkResutl, changeBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);

  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );
// @ts-ignore
  let urlParse = new URL(singleBookmarkData.URL);
  // will replace only the first occurence of www.
  // let domain = urlParse.hostname
  let domain = urlParse.hostname.replace("www.", "");

  let faviconUrlApi_domain = "https://icon.horse/icon/" + domain;

  /*  
    ============= google API -> low quality
    let faviconUrlApi_google =
    "https://www.google.com/s2/favicons?domain=" + singleBookmarkData.URL;

    ===== domain will be parsed from url automatically by icon horse, BUT the fallback will still
    be from the address, so usually all fallbacks would be the same ("W") - unwanted behavior

    let faviconUrlApi = "https://icon.horse/icon?uri=" + singleBookmarkData.URL; */

  function deleteTabsLogicNotAuth(
    tabIDsToDelete: string[],
    tabs: SingleTabData[]
  ) {
    for (let tabID of tabIDsToDelete) {
      if (!tabs.filter((el) => el.id === tabID)[0].deletable) {
        continue;
      }

      deleteTabNotAuth(tabID);
    }
  }

  async function deleteTabsLogicDb(
    tabIDsToDelete: string[],
    tabs: TabDatabase_i[]
  ) {
    for (let tabID of tabIDsToDelete) {
      // @ts-ignore
      if (!tabs.filter((el) => el.id === tabID)[0]?.deletable) {
        continue;
      }

      await deleteTab({ id: tabID }).then((result) => {
        console.log(result);
      });
      // no logic for deletings tags in other bookmarks this time,
      // because other bookmars should not contain this tag anymore
    }
  }

  return (
    <div
      className={`${tabOpened ? "visible" : "hidden"}`}
      onFocus={() => {
        setFocusedTabState(null);
      }}
    >
      {tabContext.tabVisState.editBookmarkVis !== bookmarkId && (
        <div
          className={`flex justify-between ${
            isTabDraggedOver ? "bg-gray-200" : "bg-gray-50"
          } h-10 pt-2 border border-t-0 ${
            globalSettings.picBackground ? "" : "border-black border-opacity-10"
          }`}
        >
          <div className="flex truncate">
            <div className="flex justify-center items-center h-6 w-6 mr-px mt-px">
              {
              // @ts-ignore
              singleBookmarkData.defaultFaviconFallback ? (
                <GlobeSVG
                  className="fill-current text-blue-800 cursor-pointer"
                  onClick={() => {
                    console.log("clicked");
                    // @ts-ignore
                    console.log(singleBookmarkData.defaultFaviconFallback);

                    userIdOrNoId
                      ? changeBookmark({
                          ...singleBookmarkData,
                          userId: authContext.authenticatedUserId as string,
                          // @ts-ignore
                          defaultFaviconFallback:
                          // @ts-ignore
                            !singleBookmarkData.defaultFaviconFallback,
                        })
                      : editBookmarkNotAuth(
                          singleBookmarkData.id,
                          // @ts-ignore
                          singleBookmarkData.title,
                          // @ts-ignore
                          singleBookmarkData.URL,
                          singleBookmarkData.tags,
                          // @ts-ignore
                          !singleBookmarkData.defaultFaviconFallback
                        );
                  }}
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                />
              ) : (
                <img
                  src={faviconUrlApi_domain}
                  alt="favicon"
                  className="cursor-pointer"
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                  onClick={() => {
                    userIdOrNoId
                      ? changeBookmark({
                          ...singleBookmarkData,
                          userId: authContext.authenticatedUserId as string,
                          // @ts-ignore
                          defaultFaviconFallback:
                          // @ts-ignore
                            !singleBookmarkData.defaultFaviconFallback,
                        })
                      : editBookmarkNotAuth(
                          singleBookmarkData.id,
                          // @ts-ignore
                          singleBookmarkData.title,
                          // @ts-ignore
                          singleBookmarkData.URL,
                          singleBookmarkData.tags,
                          // @ts-ignore
                          !singleBookmarkData.defaultFaviconFallback
                        );
                  }}
                />
              )}
            </div>
            <div className="truncate">
              <a
              // @ts-ignore
                href={singleBookmarkData.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="z-50 hover:text-gray-600 transition-colors duration-75 focus-1-darkGray mx-0.5"
              >
                {
                // @ts-ignore
                singleBookmarkData.title}
              </a>
            </div>
          </div>
          <div
            className="flex fill-current text-gray-500"
            style={{ marginTop: "2px" }}
          >
            <button
              className="h-5 w-5 ml-1 focus-1-inset-darkGray"
              onClick={() => {
                tabContext.tabVisDispatch({
                  type: "EDIT_BOOKMARK_OPEN",
                  payload: bookmarkId,
                });
                upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                setBookmarkId(singleBookmarkData.id);
              }}
              aria-label={"Edit bookmark"}
            >
              <PencilSmallSVG className="h-full w-full transition-colors duration-75 hover:text-black cursor-pointer" />
            </button>

            <button
              className="h-5 w-5 ml-1 focus-1-inset-darkGray"
              onClick={async () => {
                if (!userIdOrNoId) {
                  // @ts-ignore
                  let bookmarkToDelete = bookmarks.find(
                    // @ts-ignore
                    (obj) => obj.id === bookmarkId
                  );

                  if (bookmarkToDelete) {
                    let tabIdsToDelete = getTabsToDelete(
                      bookmarkToDelete.id,
                      bookmarkToDelete.tags
                    );

                    if (tabIdsToDelete.length === 0) {
                      // @ts-ignore
                      deleteBookmarkNotAuth(bookmarkId, singleBookmarkData);
                      return;
                    }

                    deleteTabsLogicNotAuth(
                      tabIdsToDelete,
                      tabs as SingleTabData[]
                    );
                    // @ts-ignore
                    deleteBookmarkNotAuth(bookmarkId, singleBookmarkData);
                  }

                  return;
                }

                function getTabsToDeleteDb(bookmarkIdToDelete: string) {
                  // should contain all tags, but without the tags present in bookmark to del
                  let arrOfTags: string[] = [];

                  let bmarksWithoutBkmarkToDel: BookmarkDatabase_i[] = (
                    bookmarks as BookmarkDatabase_i[]
                  ).filter((el) => el.id !== bookmarkIdToDelete);

                  // pushing unique tags to arrOfAllTags
                  for (let bmark of bmarksWithoutBkmarkToDel) {
                    for (let tag of bmark.tags) {
                      if (arrOfTags.indexOf(tag) === -1) {
                        arrOfTags.push(tag);
                      }
                    }
                  }
                  // first item in the arr is bookmark to delete
                  let bookmarkToDeleteArr: BookmarkDatabase_i[] = (
                    bookmarks as BookmarkDatabase_i[]
                  ).filter((el) => el.id === bookmarkIdToDelete);

                  let tagsToDelete: string[] = [];

                  // if one of the tag(tab) of bookmark to del is not present is all tags -> this tags (tabs) to delete
                  for (let tag of bookmarkToDeleteArr[0].tags) {
                    if (arrOfTags.indexOf(tag) === -1) {
                      tagsToDelete.push(tag);
                    }
                  }

                  return tagsToDelete;
                }

                let tabIdsToDelete = getTabsToDeleteDb(bookmarkId);

                if (tabIdsToDelete.length === 0) {
                  await deleteBookmark({ id: bookmarkId }).then((result) =>
                    console.log(result)
                  );
                  return;
                }

                await deleteTabsLogicDb(
                  tabIdsToDelete,
                  tabs as TabDatabase_i[]
                );

                await deleteBookmark({ id: bookmarkId }).then((result) =>
                  console.log(result)
                );
              }}
              aria-label={"Delete bookmark"}
            >
              <TrashSmallSVG className="h-full w-full transition-colors duration-75 hover:text-black cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {tabContext.tabVisState.editBookmarkVis === bookmarkId && (
        <Bookmark_newAndEdit
          bookmarkComponentType="edit"
          colNumber={colNumber}
          bookmarkId={bookmarkId as string}
          globalSettings={globalSettings}
          userIdOrNoId={userIdOrNoId}
        />
      )}
    </div>
  );
}

export default SingleBookmark;

import React, { useEffect, useRef } from "react";
import { useMutation } from "urql";
import FocusLock from "react-focus-lock";

import SelectableList from "../Shared/SelectableList";
import BookmarkErrors_render from "../Shared/BookmarkErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";
import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";

import {
  AddBookmarkMutation,
  AddTabMutation,
} from "../../graphql/graphqlMutations";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import {
  useBookmarksDb,
  ReexecuteBookmarks,
} from "../../state/hooks/useBookmarksDb";
import { useUpperUiContext } from "../../context/upperUiContext";

import {
  createFolderTab,
  createBookmarkDb,
  createFolderTabDb,
  createBookmarkNotAuth,
} from "../../utils/funcs and hooks/objCreators";
import { bookmarkErrorHandling } from "../../utils/funcs and hooks/bookmarkErrorHandling";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";

import {
  BookmarkErrors,
  GlobalSettingsState,
  SetBookmarkErrors,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { TabDatabase_i } from "../../utils/tabType";
import { BookmarkDatabase_i } from "../../utils/bookmarkType";

interface Props {
  titleInput: string;
  setTitleInput: React.Dispatch<React.SetStateAction<string>>;
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  visibleTags: string[];
  setVisibleTags: React.Dispatch<React.SetStateAction<string[]>>;
  initialTags: string[];
  selectablesListVis: boolean;
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>;
  notesTitlesArr: string[];
  rssTitlesArr: string[];
  bookmarkComponentType: "new_upperUI" | "new_lowerUI" | "edit";
  errors: BookmarkErrors;
  setErrors: SetBookmarkErrors;
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function NewBookmark_UpperUI({
  titleInput,
  setTitleInput,
  urlInput,
  setUrlInput,
  selectablesInputStr,
  setSelectablesInputStr,
  visibleTags,
  initialTags,
  selectablesListVis,
  setSelectablesListVis,
  notesTitlesArr,
  rssTitlesArr,
  errors,
  setErrors,
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as BookmarkDatabase_i[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const reexecuteBookmarks = useBookmarksDb(
    (store) => store.reexecuteBookmarks
  );
  const addTabsNotAuth = useTabs((store) => store.addTabs);

  const [addTabResult, addTab] = useMutation<any, TabDatabase_i>(
    AddTabMutation
  );
  const [addBookmarkResult, addBookmark] = useMutation<any, BookmarkDatabase_i>(
    AddBookmarkMutation
  );

  const addBookmarkNotAuth = useBookmarks((store) => store.addBookmark);
  const uiColor = globalSettings.uiColor;
  const upperUiContext = useUpperUiContext();

  let selectablesRef = useRef<HTMLInputElement>(null);
  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  let tagsInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    tagsInputArr = selectablesInputStr_noComma.split(", ");
  }

  async function addBookmarkWrapper() {
    // all tags always being added
    // let tagsInputArr_ToIds: string[] = ["ALL_TAGS"];
    let tagsInputArr_ToIds: string[] = [
      // @ts-ignore
      tabs.find((obj) => !obj.deletable)?.id as string,
    ];

    let newTabsToAddDb: TabDatabase_i[] = [];
    let newTabsToAddNotAuth: SingleTabData[] = [];

    // getting higher priority for each subsequent tab that is being added at the same time
    let counterForIndices = 0;

    tagsInputArr.forEach((el) => {
      // @ts-ignore
      let tabCorrespondingToTag = tabs.find((obj) => obj.title === el);

      let sortedTabsInCol = tabs
      // @ts-ignore
        .filter((obj) => obj.column === 1)
        // @ts-ignore
        .sort((a, b) => a.priority - b.priority);

      let newTabPriority =
        sortedTabsInCol[sortedTabsInCol.length - 1].priority +
        1 +
        counterForIndices;

      // if folder with title corresponding to tag doesn't exist create it...
      if (!tabCorrespondingToTag && selectablesInputStr !== "") {
        let newTabDb: TabDatabase_i | null;
        let newTabNotAuth: SingleTabData | null;

        newTabDb = userIdOrNoId
          ? createFolderTabDb(globalSettings.userId, el, 1, newTabPriority)
          : null;

        newTabNotAuth = userIdOrNoId
          ? null
          : createFolderTab(el, 1, newTabPriority);

        tagsInputArr_ToIds.push(
          userIdOrNoId
            ? (newTabDb as TabDatabase_i).id
            : (newTabNotAuth as SingleTabData).id
        );

        if (userIdOrNoId) {
          newTabsToAddDb.push(newTabDb as TabDatabase_i);
        } else {
          newTabsToAddNotAuth.push(newTabNotAuth as SingleTabData);
        }

        counterForIndices++;
      } else {
        // if input is not empty (if it is empty, "ALL_TAG" will be the only tag)
        if (selectablesInputStr !== "" && tabCorrespondingToTag) {
          tagsInputArr_ToIds.push(tabCorrespondingToTag.id);
        }
      }
    });

    if (newTabsToAddDb.length > 0 && userIdOrNoId) {
      let arrOfPromises = newTabsToAddDb.map((obj) => addTab(obj));

      let arrOfNewFolderObjs = await Promise.all(arrOfPromises);

      arrOfNewFolderObjs.forEach((obj) => {
        tagsInputArr_ToIds.push(obj.data.addTab.id);
      });
    }

    if (newTabsToAddNotAuth.length > 0 && !userIdOrNoId) {
      addTabsNotAuth(newTabsToAddNotAuth);
    }

    if (!userIdOrNoId) {
      addBookmarkNotAuth(
        createBookmarkNotAuth(titleInput, urlInput, tagsInputArr_ToIds)
      );
      return;
    }

    let bookmarkPromise = new Promise((resolve, reject) => {
      addBookmark(
        createBookmarkDb(
          globalSettings.userId,
          titleInput,
          urlInput,
          tagsInputArr_ToIds
        )
      ).then((result) => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result.data.addBookmark);
      });
    });

    await bookmarkPromise;
    if (bookmarks.length === 0 && userIdOrNoId) {
      (reexecuteBookmarks as ReexecuteBookmarks)({
        requestPolicy: "network-only",
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_inner(
      event,
      event.code,
      selectablesListVis,
      setSelectablesListVis,
      setSelectablesInputStr,
      selectablesRef,
      upperUiContext,
      1
    );
  }

  function saveFunc() {
    let isThereAnError = bookmarkErrorHandling(
      titleInput,
      urlInput,
      tagsInputArr,
      selectablesInputStr,
      notesTitlesArr,
      rssTitlesArr,
      // @ts-ignore
      bookmarks,
      setErrors,
      setSelectablesListVis,
      "new_upperUI"
    );
    if (isThereAnError) return;

    // 1. adding bookmark  2. adding folder/s if some tags do not correspond to existing folders
    addBookmarkWrapper();
    upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
    upperUiContext.upperVisDispatch({
      type: "FOCUS_ON_UPPER_RIGHT_UI",
      payload: 1,
    });
  }

  return (
    <FocusLock>
      {/* 
      opacity cannot be used, because children will inherit it and the text
     won't be readable
     */}
      <div
        className="flex z-50 fixed h-full w-screen items-center justify-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
        }}
      >
        <div
          className={`bg-warmGray-100 pb-2 pt-3 pl-2 pr-0.5 border-2 border-${uiColor} rounded-sm md:mb-48`}
          style={{
            width: "350px",
            marginLeft: `${
              mainPaddingRight && scrollbarWidth >= 10
                ? `-${scrollbarWidth - 1}px`
                : ""
            }`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <p className="text-center">New bookmark</p>
          <div className="flex justify-around mb-2 mt-3">
            <p className="flex-none" style={{ width: "60px" }}>
              Title
            </p>
            <input
              type="text"
              ref={firstFieldRef}
              className="w-full border pl-px focus-1"
              value={titleInput}
              placeholder={"new bookmark title"}
              onChange={(e) => setTitleInput(e.target.value)}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            <div className="w-5 flex-none"></div>
          </div>
          <div className="flex justify-around mb-2">
            <p className="flex-none" style={{ width: "60px" }}>
              Link
            </p>

            <input
              type="text"
              className="w-full border pl-px focus-1"
              value={urlInput}
              placeholder={"enter proper URL address"}
              onChange={(e) => setUrlInput(e.target.value)}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            <div className="w-5 flex-none"></div>
          </div>
          <div className="flex justify-start mb-2">
            <p className="flex-none" style={{ width: "60px" }}>
              Folders
            </p>

            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  className={`w-full border pl-px ${
                    selectablesInputStr.length !== 0 ? "pr-9" : ""
                  } focus-1`}
                  ref={selectablesRef}
                  value={selectablesInputStr}
                  placeholder={"folder1, folder2..."}
                  onChange={(e) => {
                    if (!selectablesListVis) setSelectablesListVis(true);

                    let target = e.target.value;

                    setSelectablesInputStr(target);
                  }}
                  onFocus={(e) => {
                    setSelectablesListVis(true);
                  }}
                />
                {selectablesInputStr.length !== 0 && (
                  <span
                    className="flex absolute h-4 bg-white z-50"
                    style={{ top: "7px", right: "2px" }}
                  >
                    <CheckSVG
                      className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                      onClick={saveFunc}
                    />
                    <XsmallSVG
                      className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                      onClick={() => setSelectablesInputStr("")}
                    />
                  </span>
                )}
              </div>

              {selectablesListVis && (
                <SelectableList
                  setSelectablesInputStr={setSelectablesInputStr}
                  selectablesInputStr={selectablesInputStr}
                  visibleSelectables={visibleTags}
                  initialSelectables={initialTags}
                  setSelectablesVis={setSelectablesListVis}
                  marginTop="0px"
                />
              )}
            </div>

            <div className="w-5 h-5 mt-1 flex-none">
              {selectablesListVis ? (
                <ChevronUpSVG
                  className="h-full cursor-pointer hover:text-blueGray-500"
                  onClick={() => {
                    setSelectablesListVis((b) => !b);
                  }}
                />
              ) : (
                <ChevronDownSVG
                  className="h-full cursor-pointer hover:text-blueGray-500"
                  onClick={() => {
                    setSelectablesListVis((b) => !b);
                  }}
                />
              )}
            </div>
          </div>

          <BookmarkErrors_render errors={errors} />

          <div
            className="w-full flex justify-center"
            style={{ marginTop: "26px" }}
          >
            <button
              className="h-5 w-5 mr-6 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();
                saveFunc();
              }}
              aria-label={"Save"}
            >
              <SaveSVG className="h-5 w-5 fill-current text-black hover:text-green-600 cursor-pointer transition-colors duration-75" />
            </button>

            <button
              className="h-5 w-5 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();
                upperUiContext.upperVisDispatch({
                  type: "NEW_BOOKMARK_TOGGLE",
                });
                upperUiContext.upperVisDispatch({
                  type: "FOCUS_ON_UPPER_RIGHT_UI",
                  payload: 1,
                });
              }}
              aria-label={"Close"}
            >
              <CancelSVG className="h-5 w-5 fill-current text-black hover:text-red-600 cursor-pointer transition-colors duration-75" />
            </button>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default NewBookmark_UpperUI;

import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "urql";

import Bookmark_lowerUI_edit from "./Bookmark_lowerUI_edit";
import Bookmark_lowerUI_new from "./Bookmark_lowerUI_new";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useTabContext } from "../../context/tabContext";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import {
  useBookmarksDb,
  ReexecuteBookmarks,
} from "../../state/hooks/useBookmarksDb";

import {
  createBookmarkNotAuth,
  createBookmarkDb,
  createFolderTab,
  createFolderTabDb,
} from "../../utils/funcs and hooks/objCreators";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { bookmarkErrorHandling } from "../../utils/funcs and hooks/bookmarkErrorHandling";
import {
  AddBookmarkMutation,
  ChangeBookmarkMutation,
  AddTabMutation,
  DeleteTabMutation,
} from "../../graphql/graphqlMutations";

import {
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { BookmarkErrors, SetBookmarkErrors } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../utils/bookmarkType";
import { TabDatabase_i } from "../../utils/tabType";

interface TabId {
  id: string;
}

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
  bookmarkId: string;
  currentBookmark: BookmarkDatabase_i | SingleBookmarkData;
  colNumber: number;
  errors: BookmarkErrors;
  setErrors: SetBookmarkErrors;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function Bookmark_lowerUI({
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
  bookmarkComponentType,
  bookmarkId,
  currentBookmark,
  colNumber,
  errors,
  setErrors,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const addBookmarkNotAuth = useBookmarks((store) => store.addBookmark);
  const editBookmarkNotAuth = useBookmarks((store) => store.editBookmark);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  const reexecuteBookmarks = useBookmarksDb(
    (store) => store.reexecuteBookmarks
  );

  const getTabsToDelete = useBookmarks((store) => store.getTabsToDelete);

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const [addBookmarkResult, addBookmark] = useMutation<any, BookmarkDatabase_i>(
    AddBookmarkMutation
  );

  const [editBookmarkResult, editBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);

  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  const [addTabResult, addTab] = useMutation<any, TabDatabase_i>(
    AddTabMutation
  );

  const addTabsNotAuth = useTabs((store) => store.addTabs);
  const deleteTabNotAuth = useTabs((store) => store.deleteTab);

  const tabContext = useTabContext();

  let selectablesRef = useRef<HTMLInputElement>(null);
  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  // for disabling save btn
  const [wasAnythingChanged, setWasAnythingChanged] = useState(false);

  let tagsInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    tagsInputArr = selectablesInputStr_noComma.split(", ");
  }

  async function addOrEditBookmark() {
    // creating tags for bookmark being added
    // let tagsInputArr_ToIds: string[] = ["ALL_TAGS"];
    // non deletable folder("all bookmarks") always in the arr
    let tagsInputArr_ToIds: string[] = [
      tabs.find((obj) => !obj.deletable)?.id as string,
    ];
    // let newTabsToAdd: SingleTabData[] = [];
    let newTabsToAdd: TabDatabase_i[] | SingleTabData[] = [];

    // getting higher priority for each subsequent tab that is being added at the same time
    let counterForIndices = 0;

    tagsInputArr.forEach((el, i) => {
      let tabForCurrentTag = tabs.find((obj) => obj.title === el);

      let sortedTabsInCol = tabs
        .filter((obj) => obj.column === colNumber)
        .sort((a, b) => a.priority - b.priority);

      let newTabPriority =
        sortedTabsInCol[sortedTabsInCol.length - 1].priority +
        1 +
        counterForIndices;

      // if folder with title corresponding to tag doesn't exist create it...
      if (!tabForCurrentTag && selectablesInputStr !== "") {
        let newTab: TabDatabase_i | SingleTabData;

        newTab = userIdOrNoId
          ? createFolderTabDb(
              globalSettings.userId,
              el,
              colNumber,
              newTabPriority
            )
          : createFolderTab(el, 1, newTabPriority);
        tagsInputArr_ToIds.push(newTab.id);

        //... and add new folder tab to the main tags list
        // newTabIdsUsedByBookmarksData.push(newTab.id);
        // @ts-ignore
        newTabsToAdd.push(newTab);
        console.log("newTabsToAdd");
        console.log(newTabsToAdd);

        counterForIndices++;
      } else {
        if (selectablesInputStr !== "" && tabForCurrentTag) {
          tagsInputArr_ToIds.push(tabForCurrentTag.id);
        }
      }
    });

    if (newTabsToAdd.length > 0) {
      if (userIdOrNoId) {
        let arrOfPromises = (newTabsToAdd as TabDatabase_i[]).map((obj) =>
          addTab(obj)
        );

        let arrOfNewFolderObjs = await Promise.all(arrOfPromises);

        arrOfNewFolderObjs.forEach((obj) => {
          tagsInputArr_ToIds.push(obj.data.addTab.id);
        });
      } else {
        addTabsNotAuth(newTabsToAdd);
      }
    }

    if (!userIdOrNoId) {
      if (bookmarkComponentType === "edit") {
        let bookmarkTagsToDelete: string[] = [];

        for (let tag of currentBookmark.tags) {
          if (tagsInputArr_ToIds.indexOf(tag) === -1) {
            bookmarkTagsToDelete.push(tag);
          }
        }

        let tabIdsToDelete = getTabsToDelete(bookmarkId, bookmarkTagsToDelete);

        if (tabIdsToDelete.length > 0) {
          deleteTabsLogicNotAuth(tabIdsToDelete, tabs as SingleTabData[]);
        }

        editBookmarkNotAuth(
          bookmarkId,
          titleInput,
          urlInput,
          tagsInputArr_ToIds,
          currentBookmark.defaultFaviconFallback
        );
      } else {
        addBookmarkNotAuth(
          createBookmarkNotAuth(titleInput, urlInput, tagsInputArr_ToIds)
        );
      }

      return;
    }

    let bookmarkPromise = new Promise((resolve, reject) => {
      if (bookmarkComponentType === "edit") {
        let bookmarkTagsToDelete: string[] = [];

        for (let tag of currentBookmark.tags) {
          if (tagsInputArr_ToIds.indexOf(tag) === -1) {
            bookmarkTagsToDelete.push(tag);
          }
        }

        let tabIdsToDelete = getTabsToDeleteDb(bookmarkId);

        if (tabIdsToDelete.length > 0) {
          deleteTabsLogicDb(tabIdsToDelete, tabs as TabDatabase_i[]);
        }

        editBookmark({
          id: bookmarkId,
          userId: globalSettings.userId,
          title: titleInput,
          URL: urlInput,
          tags: tagsInputArr_ToIds,
          defaultFaviconFallback: currentBookmark.defaultFaviconFallback,
        }).then((result) => {
          if (result.error) {
            reject(result.error);
            // return;
          }
          resolve(result.data.editBookmark);
        });
      } else {
        // addBookmark(createBookmark(titleInput, urlInput, tagsInputArr_ToIds));
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
            // return;
          }
          resolve(result.data.addBookmark);
        });
      }
    });

    await bookmarkPromise;

    if (bookmarks.length === 0 && userIdOrNoId) {
      (reexecuteBookmarks as ReexecuteBookmarks)({
        requestPolicy: "network-only",
      });
    }

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
        if (!tabs.filter((el) => el.id === tabID)[0].deletable) {
          continue;
        }

        await deleteTab({ id: tabID }).then((result) => {
          console.log(result);
        });
        // no logic for deletings tags in other bookmarks this time,
        // because other bookmars should not contain this tag anymore
      }
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

      let bookmarkTagsToDelete: string[] = [];

      for (let tag of currentBookmark.tags) {
        if (tagsInputArr_ToIds.indexOf(tag) === -1) {
          bookmarkTagsToDelete.push(tag);
        }
      }

      let tagsToDelete: string[] = [];

      // if one of the tag(tab) of bookmark to del is not present is all tags -> this tags (tabs) to delete
      // for (let tag of bookmarkToDeleteArr[0].tags) {
      for (let tag of bookmarkTagsToDelete) {
        if (arrOfTags.indexOf(tag) === -1) {
          tagsToDelete.push(tag);
        }
      }

      return tagsToDelete;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_inner(
      event,
      event.code,
      selectablesListVis,
      setSelectablesListVis,
      setSelectablesInputStr,
      selectablesRef
    );
  }

  function saveFunc() {
    if (bookmarkComponentType === "edit" && !wasAnythingChanged) {
      return;
    }

    let isThereAnError = bookmarkErrorHandling(
      titleInput,
      urlInput,
      tagsInputArr,
      selectablesInputStr,
      notesTitlesArr,
      rssTitlesArr,
      bookmarks,
      setErrors,
      setSelectablesListVis,
      bookmarkComponentType,
      bookmarkComponentType === "edit" ? currentBookmark : undefined
    );
    if (isThereAnError) return;

    // 1. adding or editing bookmark
    // 2. adding folder/s (also to the main state with array of tags) if some tags do not correspond to existing folders
    // 3. (if editing bookmark) for deleting empty folder -> setting tabIdsUsedByBookmarksState
    addOrEditBookmark();

    if (bookmarkComponentType === "edit") {
      tabContext.tabVisDispatch({ type: "EDIT_BOOKMARK_CLOSE" });
    }

    if (bookmarkComponentType === "new_lowerUI") {
      tabContext.tabVisDispatch({ type: "NEW_BOOKMARK_TOOGLE" });
    }
  }

  const editAndNewProps = {
    bookmarkComponentType,
    errors,
    firstFieldRef,
    selectablesRef,
    initialTags,
    saveFunc,
    selectablesInputStr,
    setSelectablesInputStr,
    selectablesListVis,
    setSelectablesListVis,
    titleInput,
    setTitleInput,
    urlInput,
    setUrlInput,
    visibleTags,
  };

  return bookmarkComponentType === "edit" ? (
    <Bookmark_lowerUI_edit
      {...editAndNewProps}
      wasAnythingChanged={wasAnythingChanged}
      setWasAnythingChanged={setWasAnythingChanged}
    />
  ) : (
    <Bookmark_lowerUI_new {...editAndNewProps} />
  );
}

export default Bookmark_lowerUI;

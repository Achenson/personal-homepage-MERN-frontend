import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useMutation } from "urql";

import EditTab_folder from "./EditTab_folder";
import EditTab_notes from "./EditTab_notes";
import EditTab_RSS from "./EditTab_RSS";
import TabErrors from "../Shared/TabErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as CheckBigSVG } from "../../svgs/check-big.svg";
import { ReactComponent as XbigSVG } from "../../svgs/x-big.svg";
import { ReactComponent as TrashSVG } from "../../svgs/trash.svg";
import { ReactComponent as EyeSVG } from "../../svgs/eye.svg";
import { ReactComponent as EyeOffSVG } from "../../svgs/eye-off.svg";

import {
  DeleteTabMutation,
  ChangeBookmarkMutation,
  ChangeTabMutation,
} from "../../graphql/graphqlMutations";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";
import { useTabs } from "../../state/hooks/useTabs";
import { useTabContext } from "../../context/tabContext";

import { tabErrorHandling } from "../../utils/funcs and hooks/tabErrorHandling";
import { tabErrorsAllFalse as errorsAllFalse } from "../../utils/data/errors";

import {
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { TabDatabase_i } from "../../utils/tabType";
import { BookmarkDatabase_i } from "../../utils/bookmarkType";

interface TabId {
  id: string;
}

interface Props {
  tabType: "folder" | "note" | "rss";
  tabID: string;
  currentTab: TabDatabase_i;
  setTabOpened: React.Dispatch<React.SetStateAction<boolean>>;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
  tabIsDeletable: boolean;
  noteHeight?: number | null;
}

function EditTab({
  tabID,
  tabType,
  currentTab,
  setTabOpened,
  globalSettings,
  userIdOrNoId,
  tabIsDeletable,
  noteHeight,
}: Props): JSX.Element {
  const editTabNotAuth = useTabs((store) => store.editTab);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  bookmarks = userIdOrNoId
    ? (bookmarksDb as BookmarkDatabase_i[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const deleteTabNotAuth = useTabs((store) => store.deleteTab);
  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  const [changeBookmarkResult, changeBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);
  const tabContext = useTabContext();

  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  // @ts-ignore
  let tabTitle = currentTab.title;

  let rssLink: string | null | undefined = "no bookmark";

  if (tabType === "rss") {
    // @ts-ignore
    rssLink = currentTab.rssLink;
  }

  const editTag = useBookmarks((store) => store.editTag);
  const deleteTag = useBookmarks((store) => store.deleteTag);

  // for note only
  const [textAreaValue, setTextAreaValue] = useState<string | null>(
    // @ts-ignore
    currentTab.noteInput as string | null
  );

  const [tabTitleInput, setTabTitleInput] = useState<string>(
    tabTitle as string
  );

  const [rssLinkInput, setRssLinkInput] = useState<string>(rssLink as string);

  const [descriptionCheckbox, setDescriptionCheckbox] = useState(() => {
    // @ts-ignore
    if (typeof currentTab.description === "boolean") {
      // @ts-ignore
      return currentTab.description;
    }

    return globalSettings.description;
  });
  const [dateCheckbox, setDateCheckbox] = useState(() => {
    // @ts-ignore
    if (typeof currentTab.date === "boolean") {
      // @ts-ignore
      return currentTab.date;
    }
    return globalSettings.date;
  });

  // checkboxes won't be saved on Save if there were not manipulated
  //  (so they will still respond to changing default setting (they will have null as a property))
  const [wasCheckboxClicked, setWasCheckboxClicked] = useState(false);

  const [rssItemsPerPage, setRssItemsPerPage] = useState(() => {
    // @ts-ignore
    if (typeof currentTab.itemsPerPage === "number") {
      // @ts-ignore
      return currentTab.itemsPerPage;
    }
    return globalSettings.itemsPerPage;
  });

  // items per page won't be saved on Save if there were not manipulated
  const [wasItemsPerPageClicked, setWasItemsPerPageClicked] = useState(false);
  const [wasTabOpenClicked, setWasTabOpenClicked] = useState(false);

  // for disabling save btn
  const [wasAnythingClicked, setWasAnythingClicked] = useState(false);

  const [arrOfBookmarksNames, setArrayOfBookmarksNames] = useState<string[]>(
    () => {
      return calcArrOfBookmarksNames();
    }
  );

  const [deleteConfirmationVis, setDeleteConfirmationVis] = useState(false);

  function calcArrOfBookmarksNames() {
    // filtered liknks
    // @ts-ignore
    let filteredBookmarks = bookmarks.filter(
      // @ts-ignore
      (obj) => obj.tags.indexOf(currentTab.id) > -1
    );

    let arrOfBookmarksNames: string[] = [];
// @ts-ignore
    filteredBookmarks.forEach((obj) => {
      arrOfBookmarksNames.push(obj.title);
    });

    return arrOfBookmarksNames;
  }

  const [selectablesInputStr, setSelectablesInputStr] = useState<string>(
    arrOfBookmarksNames.join(", ")
  );

  useEffect(() => {
    if (wasCheckboxClicked || wasTabOpenClicked || wasItemsPerPageClicked) {
      setWasAnythingClicked(true);
    }
  }, [wasCheckboxClicked, wasTabOpenClicked, wasItemsPerPageClicked]);

  const [errors, setErrors] = useState({
    ...errorsAllFalse,
  });

  const [tabOpenedByDefault, setTabOpenedByDefault] = useState(
    // @ts-ignore
    currentTab.openedByDefault
  );

  const [selectablesListVis, setSelectablesListVis] = useState<boolean>(false);

  function titleWidth() {
    // if (tabType === "note" || tabID === "ALL_TAGS") {
      // @ts-ignore
    if (tabType === "note" || !currentTab.deletable) {
      return "40px";
    }
    if (tabType === "rss") return "65px";
    if (tabType === "folder") return "87px";
  }

  let bookmarksInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    bookmarksInputArr = selectablesInputStr_noComma.split(", ");
  }

  function editTabWrapper() {
    if (!userIdOrNoId) {
      editTabNotAuth(
        tabID,
        tabTitleInput,
        textAreaValue,
        rssLinkInput,
        globalSettings.date === dateCheckbox ? null : dateCheckbox,
        globalSettings.description === descriptionCheckbox
          ? null
          : descriptionCheckbox,
        globalSettings.itemsPerPage === rssItemsPerPage
          ? null
          : rssItemsPerPage,
        wasTabOpenClicked,
        wasCheckboxClicked,
        wasItemsPerPageClicked,
        tabType,
        tabOpenedByDefault,
        setTabOpened
      );

      if (tabType === "folder") {
        // changing a tag in bookmarks
        editTag(tabID, arrOfBookmarksNames, bookmarksInputArr);
      }

      return;
    }

    if (tabType === "folder") {
      if (wasTabOpenClicked) setTabOpened(tabOpenedByDefault);
      editTab({
        ...currentTab,
        // @ts-ignore
        title: tabTitleInput,
        openedByDefault: tabOpenedByDefault,
      });

      console.log(bookmarksInputArr);

      let finalBookmarks = (bookmarks as BookmarkDatabase_i[]).filter((obj) =>
      // @ts-ignore
        bookmarksInputArr.includes(obj.title)
      );

      // adding new tag (tabID) to bookmarks
      finalBookmarks.forEach((obj) => {
        if (!obj.tags.includes(tabID)) {
          let newTags = [...obj.tags];
          newTags.push(tabID);
          changeBookmark({ ...obj, tags: newTags });
        }
      });

      // deleting =======
      // initial bookmarks
      let initialBookmarks = (bookmarks as BookmarkDatabase_i[]).filter((obj) =>
      // @ts-ignore
        arrOfBookmarksNames.includes(obj.title)
      );

      initialBookmarks.forEach((obj) => {
        // if final bookmarks does not include an initial bookmark
        // @ts-ignore
        if (!bookmarksInputArr.includes(obj.title)) {
          let newTags = [...obj.tags];
          // delete tabID from this initial bookmark
          let indexOfTabId = newTags.indexOf(tabID);
          newTags.splice(indexOfTabId, 1);
          changeBookmark({ ...obj, tags: newTags });
        }
      });

      return;
    }

    if (tabType === "note") {
      if (wasTabOpenClicked) setTabOpened(tabOpenedByDefault);
      editTab({
        ...currentTab,
        // @ts-ignore
        title: tabTitleInput,
        openedByDefault: tabOpenedByDefault,
        noteInput: textAreaValue,
      });
    }

    if (tabType === "rss") {
      if (wasTabOpenClicked) setTabOpened(tabOpenedByDefault);
      editTab({
        ...currentTab,
        // @ts-ignore
        title: tabTitleInput,
        openedByDefault: tabOpenedByDefault,
        rssLink: rssLinkInput,
        date: globalSettings.date === dateCheckbox ? null : dateCheckbox,
        description:
          globalSettings.description === descriptionCheckbox
            ? null
            : descriptionCheckbox,
        itemsPerPage:
          globalSettings.itemsPerPage === rssItemsPerPage
            ? null
            : rssItemsPerPage,
      });
    }
  }

  function saveFunc() {
    if (!wasAnythingClicked) {
      return;
    }

    let isThereAnError = tabErrorHandling(
      // @ts-ignore
      bookmarks,
      tabTitleInput,
      setErrors,
      setSelectablesListVis,
      tabType,
      bookmarksInputArr,
      rssLinkInput,
      // @ts-ignore
      tabs,
      textAreaValue,
      "edit",
      tabTitle
    );
    if (isThereAnError) return;

    // 1.edit tab(folder,rss or note)
    // 2. (in case of folders) delete tag from bookmark or add tag to bookmark
    editTabWrapper();

    tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
  }

  function deleteTabLogic() {
    // @ts-ignore
    if (!currentTab.deletable) {
      // setNoDeletionErrorVis(true);
      setErrors({
        ...errorsAllFalse,
        noDeletionErrorVis: true,
      });
      return;
    }

    if (userIdOrNoId) {
      deleteTab({ id: tabID }).then((result) => {
        if (tabType === "note" || tabType === "rss") {
          return;
        }

        let filteredBookmarks = (bookmarks as BookmarkDatabase_i[]).filter(
          (obj) => obj.tags.indexOf(result.data.deleteTab.id) > -1
        );

        filteredBookmarks.forEach((obj) => {
          let changedBookmark = { ...obj };
          let indexOfDeletedTab = changedBookmark.tags.indexOf(
            result.data.deleteTab.id
          );
          changedBookmark.tags.splice(indexOfDeletedTab, 1);
          changeBookmark(changedBookmark);
        });
      });
    } else {
      deleteTabNotAuth(tabID);
    }

    tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });

    // removing deleted tab(tag) from bookmarks
    if (!userIdOrNoId) {
      deleteTag(tabTitle);
    }
  }

  return (
    <FocusLock>
      <div
        className={`absolute w-full z-40 bg-gray-50 pb-2 border border-blueGray-303 pl-1 pr-1 shadow-md`}
      >
        <div className="mb-3">
          <div className={`flex items-center mt-2 justify-between`}>
            <p className="flex-none" style={{ width: `${titleWidth()}` }}>
              Title
            </p>
            <input
              type="text"
              ref={firstFieldRef}
              // min-w-0 !!
              className="border w-full max-w-6xl pl-px focus-1"
              value={tabTitleInput}
              onChange={(e) => {
                setTabTitleInput(e.target.value);
                setWasAnythingClicked(true);
              }}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            {/* {tabType === "folder" && tabID !== "ALL_TAGS" && ( */}
            {
              // @ts-ignore
            tabType === "folder" && currentTab.deletable && (
              <div
                style={{ height: "18px", width: "18px" }}
                className="flex-none -mr-1"
              ></div>
            )}
          </div>

          {/* {tabType === "folder" && tabID !== "ALL_TAGS" && ( */}
        
          {
            // @ts-ignore
          tabType === "folder" && currentTab.deletable && (
            <EditTab_folder
              selectablesListVis={selectablesListVis}
              setSelectablesListVis={setSelectablesListVis}
              wasAnythingClicked={wasAnythingClicked}
              setWasAnythingClicked={setWasAnythingClicked}
              selectablesInputStr={selectablesInputStr}
              setSelectablesInputStr={setSelectablesInputStr}
              saveFunc={saveFunc}
              userIdOrNoId={userIdOrNoId}
            />
          )}

          {tabType === "note" && (
            <EditTab_notes
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
              setWasAnythingClicked={setWasAnythingClicked}
              noteHeight={noteHeight as number | null}
            />
          )}

          {tabType === "rss" && (
            <EditTab_RSS
              dateCheckbox={dateCheckbox}
              descriptionCheckbox={descriptionCheckbox}
              rssItemsPerPage={rssItemsPerPage}
              setDateCheckbox={setDateCheckbox}
              setDescriptionCheckbox={setDescriptionCheckbox}
              setRssItemsPerPage={setRssItemsPerPage}
              setWasAnythingClicked={setWasAnythingClicked}
              setWasCheckboxClicked={setWasCheckboxClicked}
              setWasItemsPerPageClicked={setWasItemsPerPageClicked}
              tabID={tabID}
              rssLinkInput={rssLinkInput}
              setRssLinkInput={setRssLinkInput}
              globalSettings={globalSettings}
              userIdOrNoId={userIdOrNoId}
              currentTab={currentTab}
            />
          )}

          <div className={`${tabType === "rss" ? "mt-1.5" : ""}`}>
            <TabErrors
              errors={errors}
              tabType={tabType}
              componentType={"edit"}
            />
          </div>
        </div>

        <div className={`pt-2`} style={{ borderTop: "solid lightGray 1px" }}>
          <div className="flex justify-between items-center">
            <p>Default content visibility</p>

            {tabOpenedByDefault ? (
              <button
                className="h-6 w-6 focus-2"
                onClick={() => {
                  // @ts-ignore
                  setTabOpenedByDefault((b) => !b);
                  setWasTabOpenClicked(true);
                  setSelectablesListVis(false);
                }}
                aria-label={"Disable tab content visibility by default"}
              >
                <EyeSVG className="text-gray-500 transition-colors duration-75 hover:text-black cursor-pointer" />
              </button>
            ) : (
              <button
                className="h-6 w-6 focus-2"
                onClick={() => {
                  // @ts-ignore
                  setTabOpenedByDefault((b) => !b);
                  setWasTabOpenClicked(true);
                  setSelectablesListVis(false);
                }}
                aria-label={"Enable tab content visibility by default"}
              >
                <EyeOffSVG className="h-6 w-6 text-gray-500 transition-colors duration-75 hover:text-black cursor-pointer" />
              </button>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            {deleteConfirmationVis ? (
              <>
                <p className="text-red-500">Delete current tab?</p>

                <div className="w-14 flex justify-between">
                  <button
                    className="h-6 w-6 focus-2 text-gray-500 transition-colors duration-75 hover:text-black"
                    onClick={deleteTabLogic}
                    aria-label={"Confirm tab deletion"}
                  >
                    <CheckBigSVG className=" text-gray-500 hover:text-black cursor-pointer transition-colors duration-75" />
                  </button>
                  <button
                    className="h-6 w-6 focus-2 text-gray-500 transition-colors duration-75 hover:text-black"
                    onClick={() => setDeleteConfirmationVis(false)}
                    aria-label={"Cancel tab deletion"}
                  >
                    <XbigSVG className="text-gray-500 hover:text-black cursor-pointer transition-colors duration-75" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Delete</p>

                <button
                  className="h-6 w-6 focus-2"
                  onClick={() => {
                    if (!tabIsDeletable) {
                      deleteTabLogic();
                      return;
                    }
                    setDeleteConfirmationVis(true);
                  }}
                  aria-label={"Delete tab"}
                >
                  <TrashSVG className="h-6 w-6 text-gray-500 transition-colors duration-75 hover:text-black cursor-pointer" />
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className={`w-full flex justify-center ${
            tabType === "folder" ? "" : "mt-0.5"
          } `}
        >
          <button
            className="h-5 w-5 mr-6 focus-2-offset-dark"
            onClick={(e) => {
              e.preventDefault();
              saveFunc();
            }}
          >
            <SaveSVG
              className={`h-5 w-5 fill-current transition-colors duration-75 ${
                wasAnythingClicked
                  ? "text-gray-900 hover:text-green-600 cursor-pointer"
                  : "text-blueGray-400 cursor-default"
              }`}
              aria-label={"Save"}
            />
          </button>

          <button
            className="h-5 w-5 focus-2-offset-dark"
            onClick={(e) => {
              e.preventDefault();
              tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
            }}
            aria-label={"Close"}
          >
            <CancelSVG className="h-5 w-5 fill-current text-gray-900 hover:text-red-600 cursor-pointer transition-colors duration-75" />
          </button>
        </div>
      </div>
    </FocusLock>
  );
}

export default EditTab;

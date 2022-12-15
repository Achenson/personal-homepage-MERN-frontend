import React, { useEffect, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import { useMutation } from "urql";

import SingleBookmark from "./SingleBookmark";
import ColorsToChoose_Tab from "../Colors/ColorsToChoose_Tab";
import Bookmark_newAndEdit from "../Shared/Bookmark_newAndEdit";
import EditTab_main from "./EditTab_main";
import NoteInput from "./NoteInput";
import RSS_reactQuery from "./RSS_reactQuery";

import { ReactComponent as ColorSmallSVG } from "../../svgs/beakerSmall.svg";
import { ReactComponent as PencilSmallSVG } from "../../svgs/pencilSmall.svg";
import { ReactComponent as CrossArrowsSVG } from "../../svgs/cross-arrows.svg";
import { ReactComponent as PlusSVG } from "../../svgs/plus.svg";

import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { useReset } from "../../state/hooks/useReset";
import { useTabBeingDraggedColor } from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabReducer } from "../../context/useTabReducer";
import { TabContext } from "../../context/tabContext";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import { dragTabDb } from "../../utils/funcs and hooks/dragTabDb";
import { ItemTypes } from "../../utils/data/itemsDnd";

import {
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../../schema/types/tabType";

interface Item {
  type: string;
  tabID: string;
  colNumber: number;
  tabColor: string;
}

interface Props {
  tabID: string;
  tabTitle: string;
  tabColor: string | null;
  tabType: "folder" | "note" | "rss";
  colNumber: number;
  tabOpenedByDefault: boolean;
  tabIsDeletable: boolean;
  globalSettings: GlobalSettingsState;
  currentTab: TabDatabase_i | SingleTabData;
  userIdOrNoId: string | null;
}

function Tab({
  tabID,
  tabTitle,
  tabColor,
  tabType,
  colNumber,
  tabOpenedByDefault,
  tabIsDeletable,
  globalSettings,
  currentTab,
  userIdOrNoId,
}: Props): JSX.Element {
  const [noteHeight, setNoteHeight] = useState<number | null>(null);

  const setTabBeingDraggedColor = useTabBeingDraggedColor(
    (store) => store.setTabBeingDraggedColor
  );

  const [tabOpened, setTabOpened] = useState(tabOpenedByDefault);
  // needed for immediate tab content opening/closing after locking/unlocking
  const setReset = useReset((store) => store.setReset);
  const resetEnabled = useReset((store) => store.enabled);
  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  let tabs: TabDatabase_i[] | SingleTabData[];
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const tabOpenedState = useTabs((store) => store.tabOpenedState);
  const closeAllTabsState = useTabs((store) => store.closeAllTabsState);
  const setCloseAllTabsState = useTabs((store) => store.setCloseAllTabsState);
  const focusedTabState = useTabs((store) => store.focusedTabState);
  const setFocusedTabState = useTabs((store) => store.setFocusedTabState);
  const setTabOpenedState = useTabs((store) => store.setTabOpenedState);

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const upperUiContext = useUpperUiContext();

  const [iconsVis, setIconsVis] = useState<boolean>(false);

  useEffect(() => {
    if (focusedTabState === tabID) {
      setIconsVis(true);
    } else {
      setIconsVis(false);
    }
  }, [focusedTabState, tabID]);

  const [tabVisState, tabVisDispatch] = useTabReducer(
    tabID,
    setTabOpenedState,
    setReset
    // tabOpenedByDefault
  );

  let tabContextValue = { tabVisState, tabVisDispatch };

  useEffect(() => {
    if (tabOpenedState !== tabID) {
      tabVisDispatch({ type: "TAB_EDITABLES_CLOSE" });
    }
  }, [tabOpenedState, tabID, tabVisDispatch]);

  useEffect(() => {
    if (!isTabInDefaultState()) {
      setReset(true);
    }

    function isTabInDefaultState() {
      let isDefault = true;

      if (tabOpened !== tabOpenedByDefault) {
        isDefault = false;
        return;
      }

      return isDefault;
    }
  }, [setReset, tabs, tabOpened, tabOpenedByDefault]);

  useEffect(() => {
    if (closeAllTabsState && tabOpened !== tabOpenedByDefault) {
      setTabOpened(tabOpenedByDefault);
      // setTimeout(() => {
      //   setCloseAllTabsState(false);
      // }, 500);
      setCloseAllTabsState(false);
      return;
    }
    setCloseAllTabsState(false);
  }, [closeAllTabsState, setCloseAllTabsState, tabOpened, tabOpenedByDefault]);

  const [bookmarkId, setBookmarkId] = useState<string>();

  const [crossVis, setCrossVis] = useState<boolean>(true);

  let finalTabColor: string = "";

  if (tabColor) {
    finalTabColor = tabColor;
  } else {
    if (tabType === "folder") {
      finalTabColor = globalSettings.folderColor;
    }

    if (tabType === "note") {
      finalTabColor = globalSettings.noteColor;
    }

    if (tabType === "rss") {
      finalTabColor = globalSettings.rssColor;
    }
  }

  const dragTab = useTabs((store) => store.dragTab);

  // we get two things:
  //  1.) object containing all props - we will get that from collection functions
  // the collecting functions will turn monitor events into props
  // 2.) A ref - the result of this useDrag hook is going to be attached to that specific DOM element
  // isDragging - props coming from collecting function
  const [{ isDragging }, drag] = useDrag({
    // the result that will come from out useDrag hook
    item: {
      // type is required
      type: ItemTypes.BOOKMARK,
      tabID: tabID,
      colNumber: colNumber,
      tabColor: finalTabColor,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // to enable tab dragging over first tab in a column
  const [{ isOver, draggedItem }, drop] = useDrop<
    Item,
    void,
    {
      isOver: boolean;
      draggedItem: Item | null;
    }
  >({
    //    required property
    accept: ItemTypes.BOOKMARK,
    drop: (item: Item, monitor) => {
      if (draggedItem && tabID !== draggedItem.tabID) {
        userIdOrNoId
          ? dragTabDb(
              item.tabID,
              item.colNumber,
              colNumber,
              tabID,
              true,
              tabs as TabDatabase_i[],
              editTab
            )
          : dragTab(item.tabID, item.colNumber, colNumber, tabID, true);
      }
    },
    // drop: (item: Item, monitor) => console.log(item.tabID),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      draggedItem: monitor.getItem(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      setTabBeingDraggedColor(finalTabColor);
      tabVisDispatch({ type: "TAB_EDITABLES_CLOSE" });
      setTabOpenedState(null);
    }
  }, [
    isDragging,
    finalTabColor,
    setTabBeingDraggedColor,
    setTabOpenedState,
    tabVisDispatch,
  ]);

  const colorsForLightText: string[] = [
    "blueGray-500",
    "gray-500",
    "black",
    "green-505",
    "blue-500",
    "red-500",
    "violet-500",
    "purple-500",
  ];
  const colorsForDarkText: string[] = ["yellow-600"];

  // "default" behaviour
  const regexForColors = /[6789]/;
  const [mouseOverTab, setMouseOverTab] = useState(false);

  useEffect(() => {
    let iconsTimeout: ReturnType<typeof setTimeout>;

    if (mouseOverTab) {
      iconsTimeout = setTimeout(() => {
        setIconsVis(true);
      }, 50);
    }

    if (!mouseOverTab) {
      setIconsVis(false);
    }
    return () => {
      clearTimeout(iconsTimeout);
    };
  }, [mouseOverTab]);

  useEffect(() => {
    if (!upperUiContext.upperVisState.tabEditablesOpenable) {
      tabVisDispatch({ type: "TAB_EDITABLES_CLOSE" });
      upperUiContext.upperVisDispatch({
        type: "TAB_EDITABLES_OPENABLE_DEFAULT",
      });
    }
  }, [upperUiContext, tabVisDispatch]);

  function textOrIconColor(finalTabColor: string, textOrIcon: "text" | "icon") {
    // exceptions
    if (colorsForLightText.indexOf(finalTabColor) > -1) {
      return textOrIcon === "text" ? "text-gray-100" : "text-gray-200";
    }

    if (colorsForDarkText.indexOf(finalTabColor) > -1) {
      return textOrIcon === "text" ? "text-gray-900" : "text-gray-700";
    }

    if (regexForColors.test(finalTabColor)) {
      return textOrIcon === "text" ? "text-gray-100" : "text-gray-200";
    }

    return textOrIcon === "text" ? "text-gray-900" : "text-gray-700";
  }

  function hoverText(finalTabColor: string) {
    if (colorsForLightText.indexOf(finalTabColor) > -1) {
      return "text-gray-100";
    }

    if (colorsForDarkText.indexOf(finalTabColor) > -1) {
      return "text-black";
    }

    if (regexForColors.test(finalTabColor)) {
      return "text-gray-100";
    }

    return "text-black";
  }

  let isTabDraggedOver = !!(
    isOver &&
    draggedItem &&
    tabID !== draggedItem.tabID
  );

  return (
    <TabContext.Provider value={tabContextValue}>
      <div
        ref={drop}
        className={`relative ${
          globalSettings.hideNonDeletable && !tabIsDeletable ? "hidden" : ""
        }`}
      >
        <div>
          <div
            ref={globalSettings.disableDrag ? undefined : drag}
            className={`pl-0 h-8 pr-1 ${
              isTabDraggedOver && draggedItem
                ? `bg-${draggedItem.tabColor}`
                : `bg-${finalTabColor}`
            }   ${textOrIconColor(
              finalTabColor,
              "text"
            )} border border-t-0 border-r-0 border-l-0 border-gray-700 border-opacity-25 flex justify-between`}
            style={{
              boxShadow: "0px -1px inset rgba(0, 0, 0, 0.05)",
              paddingTop: "2px",
            }}
            onTouchStart={() => {
              setTimeout(() => {
                tabVisDispatch({ type: "TOUCH_SCREEN_MODE_ON" });
              }, 200);
            }}
            onMouseEnter={() => {
              setMouseOverTab(true);
            }}
            onMouseLeave={() => {
              setMouseOverTab(false);
            }}
          >
            <div
              className="pl-1 w-full h-7 truncate cursor-pointer"
              onClick={() => {
                setTabOpened((b) => !b);
                tabVisDispatch({ type: "TAB_CONTENT_TOGGLE" });
                upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                if (!resetEnabled) setReset(true);
              }}
            >
              <button
                className={`mt-px flex focus:outline-none focus-visible:ring-1 ring-${textOrIconColor(
                  finalTabColor,
                  "text"
                ).slice(5)} ring-opacity-40`}
                style={{ height: "23px" }}
                onFocus={() => {
                  setFocusedTabState(tabID);
                }}
                aria-label={"Tab open/close"}
              >
                <p
                  className={`truncate ${
                    isTabDraggedOver ? `invisible` : "visible"
                  } ${!tabIsDeletable ? "tracking-wider" : ""}`}
                >
                  {tabTitle}
                </p>
              </button>
            </div>
            <div
              className={`pt-1 flex ${
                iconsVis || tabVisState.touchScreenModeOn
                  ? "visible"
                  : "invisible"
              } fill-current ${textOrIconColor(finalTabColor, "icon")} `}
            >
              <div
                className={` ${
                  globalSettings.disableDrag ? "hidden" : ""
                } w-6 -mt-1 pt-1 cursor-move `}
                style={{ height: "29px" }}
                onMouseEnter={() => {
                  setCrossVis(false);
                }}
                onMouseLeave={() => {
                  setCrossVis(true);
                }}
              >
                {crossVis && (
                  <CrossArrowsSVG
                    className="h-6"
                    style={{ marginTop: "-2px" }}
                  />
                )}
              </div>
              {tabType === "folder" && (
                <button
                  className={`h-8 focus:outline-none focus-visible:ring-2 ring-${textOrIconColor(
                    finalTabColor,
                    "text"
                  ).slice(5)} ring-opacity-40 ring-inset   `}
                  style={{ marginTop: "-6px" }}
                  onClick={() => {
                    tabVisDispatch({ type: "NEW_BOOKMARK_TOOGLE" });
                    upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                  }}
                  aria-label={"Add new bookmark"}
                >
                  <PlusSVG
                    className={`h-full transition-colors duration-75 hover:${hoverText(
                      finalTabColor
                    )} cursor-pointer`}
                  />
                </button>
              )}
              <button
                className={`h-5 w-5 mr-2 focus:outline-none focus-visible:ring-2 ring-${textOrIconColor(
                  finalTabColor,
                  "text"
                ).slice(5)} ring-opacity-40`}
                style={{
                  marginLeft: `${
                    tabType === "note" || tabType === "rss" ? "7px" : ""
                  }`,
                }}
                onClick={() => {
                  tabVisDispatch({ type: "COLORS_SETTINGS_TOGGLE" });
                  upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                }}
                aria-label={"Tab color menu"}
              >
                <ColorSmallSVG
                  className={`h-full w-full transition-colors duration-75 hover:${hoverText(
                    finalTabColor
                  )} cursor-pointer `}
                />
              </button>
              <button
                className={`h-5 focus:outline-none focus-visible:ring-2 ring-${textOrIconColor(
                  finalTabColor,
                  "text"
                ).slice(5)} ring-opacity-40 `}
                onClick={() => {
                  if (tabType === "note" && !tabOpened) {
                    setTabOpened((b) => !b);
                    tabVisDispatch({ type: "EDIT_TOGGLE_NOTE_OPEN" });
                    upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                    if (!resetEnabled) setReset(true);
                    return;
                  }
                  tabVisDispatch({ type: "EDIT_TOGGLE" });
                  upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                }}
                aria-label={"Edit tab"}
              >
                <PencilSmallSVG
                  className={`h-full -ml-px transition-colors duration-75 hover:${hoverText(
                    finalTabColor
                  )} cursor-pointer`}
                />
              </button>
            </div>
          </div>
        </div>

        {tabVisState.colorsVis &&
          tabOpenedState === tabID &&
          upperUiContext.upperVisState.tabEditablesOpenable && (
            <ColorsToChoose_Tab
              setIconsVis={setIconsVis}
              tabID={tabID}
              tabColor={tabColor}
              tabType={tabType}
              globalSettings={globalSettings}
              currentTab={currentTab}
              userIdOrNoId={userIdOrNoId}
            />
          )}

        {tabVisState.newBookmarkVis &&
          tabOpenedState === tabID &&
          upperUiContext.upperVisState.tabEditablesOpenable && (
            <Bookmark_newAndEdit
              bookmarkComponentType={"new_lowerUI"}
              colNumber={colNumber}
              tabTitle={tabTitle as string}
              globalSettings={globalSettings}
              userIdOrNoId={userIdOrNoId}
            />
          )}

        {tabVisState.editTabVis &&
          tabOpenedState === tabID &&
          upperUiContext.upperVisState.tabEditablesOpenable && (
            <EditTab_main
              tabID={tabID}
              tabType={tabType}
              currentTab={currentTab as TabDatabase_i}
              setTabOpened={setTabOpened}
              globalSettings={globalSettings}
              userIdOrNoId={userIdOrNoId}
              tabIsDeletable={tabIsDeletable}
              noteHeight={tabType === "note" ? noteHeight : undefined}
            />
          )}

        {tabOpened && tabType === "folder" && (
          <div>
            {(userIdOrNoId
              ? (bookmarksDb as BookmarkDatabase_i[])
              : (bookmarksNotAuth as SingleBookmarkData[])
            )
              .filter((el) => el.tags.indexOf(tabID) > -1)
              .sort((a, b) => (a.title > b.title ? 1 : -1))
              .map((el, i) => {
                return (
                  <SingleBookmark
                    singleBookmarkData={el}
                    bookmarkId={el.id as string}
                    colNumber={colNumber}
                    setBookmarkId={setBookmarkId}
                    key={el.id}
                    tabID={tabID}
                    isTabDraggedOver={isTabDraggedOver}
                    globalSettings={globalSettings}
                    userIdOrNoId={userIdOrNoId}
                    tabOpened={tabOpened}
                  />
                );
              })}
          </div>
        )}

        {/* tabOpened is used in NoteInput instead */}
        {tabType === "note" && (
          <NoteInput
            currentTab={currentTab as SingleTabData}
            isTabDraggedOver={isTabDraggedOver}
            globalSettings={globalSettings}
            tabOpened={tabOpened}
            setNoteHeight={setNoteHeight}
          />
        )}

        {tabOpened && tabType === "rss" && (
          <RSS_reactQuery
            tabID={tabID}
            currentTab={currentTab as SingleTabData}
            isTabDraggedOver={isTabDraggedOver}
            globalSettings={globalSettings}
          />
        )}
      </div>
    </TabContext.Provider>
  );
}

export default Tab;

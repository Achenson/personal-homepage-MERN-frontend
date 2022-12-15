import React, { useState, useEffect } from "react";
import { useMutation } from "urql";

import Column from "./Column";

import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { useResetColors } from "../../state/hooks/colorHooks";
import { useReset } from "../../state/hooks/useReset";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";

import { BookmarkDatabase_i } from "../../utils/bookmarkType";
import { TabDatabase_i } from "../../utils/tabType";
import {
  GlobalSettingsState,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function Grid({
  setTabType,
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
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const resetAllTabColors = useTabs((store) => store.resetAllTabColors);
  const resetColors = useResetColors((store) => store.resetColors);
  const setResetColors = useResetColors((store) => store.setResetColors);
  const setReset = useReset((store) => store.setReset);
  const upperUiContext = useUpperUiContext();
  const windowSize = useWindowSize();

  const [breakpoint, setBreakpoint] = useState<0 | 1 | 2 | 3 | 4 | null>(null);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width >= 1024) {
        setBreakpoint(4);
        return;
      }

      if (windowSize.width >= 768) {
        setBreakpoint(3);
        return;
      }

      if (windowSize.width >= 640) {
        setBreakpoint(2);
        return;
      }

      if (windowSize.width >= 505) {
        setBreakpoint(1);
        return;
      }

      setBreakpoint(0);
    }
  }, [windowSize.width]);

  useEffect(() => {
    if (
      upperUiContext.upperVisState.colorsBackgroundVis ||
      upperUiContext.upperVisState.colorsColumnVis
    ) {
      setReset(true);
    }
  }, [upperUiContext, setReset]);

  useEffect(() => {
    if (resetColors) {
      userIdOrNoId
        ? (tabs as TabDatabase_i[]).forEach((obj) => {
            editTab({ ...obj, color: null });
          })
        : resetAllTabColors();

      setResetColors(false);
    }
  }, [
    resetColors,
    setResetColors,
    userIdOrNoId,
    editTab,
    resetAllTabColors,
    tabs,
  ]);

  function renderColumns(numberOfCols: 1 | 2 | 3 | 4) {
    let columnProps = {
      setTabType,
      breakpoint,
      tabs,
      userIdOrNoId,
      globalSettings: globalSettings,
    };

    switch (numberOfCols) {
      case 1:
        return <Column {...columnProps} colNumber={1} />;
      case 2:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
          </>
        );
      case 3:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
            <Column {...columnProps} colNumber={3} />
          </>
        );
      case 4:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
            <Column {...columnProps} colNumber={3} />
            <Column {...columnProps} colNumber={4} />
          </>
        );
    }
  }

  function gridSettings(
    numberOfCols: 1 | 2 | 3 | 4,
    breakpoint: 0 | 1 | 2 | 3 | 4 | null
  ) {
    if (typeof breakpoint !== "number") {
      return;
    }
    // lowest possible so sm version of UpperRightMenu still don't crash with left side
    const maxColWidth = `${globalSettings.limitColGrowth ? "350px" : "9999px"}`;

    switch (numberOfCols) {
      case 1:
        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 2:
        if (breakpoint >= 2) {
          return `repeat(2, minmax(0, ${maxColWidth}))`;
        }
        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 3:
        if (breakpoint >= 3) {
          return `repeat(3, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 2) {
          return `repeat(${breakpoint}, minmax(0, ${maxColWidth}))`;
        }

        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 4:
        if (breakpoint >= 4) {
          return `repeat(4, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 3) {
          return `repeat(3, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 2) {
          return `repeat(2, minmax(0, ${maxColWidth}))`;
        }

        return `repeat(1, minmax(0, ${maxColWidth}))`;
    }
  }

  return (
    <div className="mx-2 xs:mx-4">
      <div
        className={`grid justify-center gap-x-2 gap-y-6`}
        style={{
          // gridTemplateColumns: "repeat(1, minmax(0, 800px))"
          gridTemplateColumns: `${gridSettings(
            globalSettings.numberOfCols,
            breakpoint
          )}`,
        }}
      >
        {typeof breakpoint === "number" &&
          renderColumns(globalSettings.numberOfCols)}
      </div>
      <div className="h-72"></div>
    </div>
  );
}

export default Grid;

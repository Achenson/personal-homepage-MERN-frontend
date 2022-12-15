import React from "react";

import Tab from "./Tab";
import GapAfterTab from "./GapAfterTab";
import UpperLeftMenu from "../UpperUI/UpperLeftMenu";
import UpperRightMenu from "../UpperUI/UpperRightMenu";
import Message from "../UpperUI/Message";

import { useUpperUiContext } from "../../context/upperUiContext";
import { useAuth } from "../../state/hooks/useAuth";
import { useTabs } from "../../state/hooks/useTabs";
import { useTabsDb } from "../../state/hooks/useTabsDb";

import { GlobalSettingsState, SingleTabData } from "../../utils/interfaces";
import { TabDatabase_i } from "../../utils/tabType";

interface Props {
  colNumber: number;
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  breakpoint: 0 | 1 | 2 | 3 | 4 | null;
  userIdOrNoId: string | null;
  globalSettings: GlobalSettingsState;
}

function Column({
  colNumber,
  setTabType,
  breakpoint,
  userIdOrNoId,
  globalSettings,
}: Props): JSX.Element {
  const tabsNotAuth = useTabs((store) => store.tabs);

  const tabsDb = useTabsDb((store) => store.tabsDb);

  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();

  userIdOrNoId =
    authContext.authenticatedUserId && authContext.isAuthenticated
      ? authContext.authenticatedUserId
      : null;

  function calcColumnColor_picBackground(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (!picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      return globalSettings.colColorImg_1;
    }

    switch (colNumber) {
      case 1:
        return globalSettings.colColorImg_1;
      case 2:
        return globalSettings.colColorImg_2;
      case 3:
        return globalSettings.colColorImg_3;
      case 4:
        return globalSettings.colColorImg_4;
    }
  }

  function calcColumnColor(
    colNumber: number,
    picBackground: boolean,
    oneColorForAllColumns: boolean
  ) {
    if (picBackground) {
      return "";
    }

    if (oneColorForAllColumns) {
      return "bg-" + globalSettings.colColor_1;
    }

    switch (colNumber) {
      case 1:
        return "bg-" + globalSettings.colColor_1;
      case 2:
        return "bg-" + globalSettings.colColor_2;
      case 3:
        return "bg-" + globalSettings.colColor_3;
      case 4:
        return "bg-" + globalSettings.colColor_4;
    }
  }

  let sortedTabs: TabDatabase_i[] | SingleTabData[];

  sortedTabs = (userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth)
    .filter((el) => el.column === colNumber)
    .sort((a, b) => a.priority - b.priority);

  let lastTabId: string | null;
  if (sortedTabs.length > 0) {
    lastTabId = sortedTabs[sortedTabs.length - 1].id;
  } else {
    lastTabId = null;
  }

  let tabDataLength = (
    userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth
  ).filter((el) => el.column === colNumber).length;

  function isThisLastGap(lastTabId: string | null, tabID: string) {
    if (lastTabId === tabID) {
      return true;
    }

    return false;
  }

  function bordersIfNoBackground() {
    return `border-black border-opacity-10 ${tabDataLength === 0 ? "" : ""}`;
  }

  function shouldRightUiRender(breakpoint: 0 | 1 | 2 | 3 | 4 | null): boolean {
    let nrOfCols = globalSettings.numberOfCols;

    switch (breakpoint) {
      case 4:
        return nrOfCols === colNumber ? true : false;
      case 3:
        return (nrOfCols >= 3 && colNumber === 3) ||
          (nrOfCols === 2 && colNumber === 2) ||
          (nrOfCols === 1 && colNumber === 1)
          ? true
          : false;
      case 2:
        return (nrOfCols >= 2 && colNumber === 2) ||
          (nrOfCols === 1 && colNumber === 1)
          ? true
          : false;
      case 1:
        return colNumber === 1 ? true : false;
      case 0:
        return colNumber === 1 ? true : false;
    }

    return false;
  }

  return (
    <div
      className={`h-full relative flex flex-col ${
        globalSettings.picBackground ? "" : bordersIfNoBackground()
      }
       ${calcColumnColor(
         colNumber,
         globalSettings.picBackground,
         globalSettings.oneColorForAllCols
       )}`}
      style={{
        backgroundColor: calcColumnColor_picBackground(
          colNumber,
          globalSettings.picBackground,
          globalSettings.oneColorForAllCols
        ),
      }}
    >
      {(userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth)
        .filter((el) => el.column === colNumber)
        // lower priority, higher in the column
        .sort((a, b) => a.priority - b.priority)
        .map((el, i) => {
          return (
            <div
              key={el.id}
              className={`flex flex-col ${
                isThisLastGap(lastTabId, el.id) ? "flex-grow" : ""
              }`}
            >
              <Tab
                tabID={el.id}
                tabTitle={el.title}
                tabColor={el.color}
                tabType={el.type}
                colNumber={el.column}
                tabOpenedByDefault={el.openedByDefault}
                tabIsDeletable={el.deletable}
                globalSettings={globalSettings}
                currentTab={el}
                userIdOrNoId={userIdOrNoId}
              />
              <GapAfterTab
                colNumber={colNumber}
                tabID_orNull={el.id}
                picBackground={globalSettings.picBackground}
                isThisLastGap={isThisLastGap(lastTabId, el.id)}
                isThisTheOnlyGap={false}
                globalSettings={globalSettings}
                userIdOrNoId={userIdOrNoId}
                tabIsDeletable={el.deletable}
              />
            </div>
          );
        })}

      {tabDataLength === 0 ? (
        <div className="flex-grow">
          <GapAfterTab
            colNumber={colNumber}
            tabID_orNull={null}
            picBackground={globalSettings.picBackground}
            isThisLastGap={true}
            isThisTheOnlyGap={true}
            globalSettings={globalSettings}
            userIdOrNoId={userIdOrNoId}
            tabIsDeletable={undefined}
          />
        </div>
      ) : null}

      {/* if this is the last columns */}
      {colNumber === 1 && (
        <div
          className="absolute"
          style={{
            top: "-32px",
          }}
        >
          <UpperLeftMenu
            globalSettings={globalSettings}
            userIdOrNoId={userIdOrNoId}
          />
        </div>
      )}

      {shouldRightUiRender(breakpoint) && (
        <div>
          <div
            className="absolute"
            style={{
              top:
                upperUiContext.upperVisState.addTabVis_xs &&
                (breakpoint === 0 ||
                  // when col growth is limited && colNumber is ===1, UpperRightMenu_XS is on all breakpoints
                  (globalSettings.limitColGrowth &&
                    globalSettings.numberOfCols === 1) ||
                  // when col growth is limited, UpperRightMenu_XS is both on xs: and sm: breakpoints
                  (breakpoint === 1 && globalSettings.limitColGrowth))
                  ? `-58px`
                  : "-30px",
              right: "0px",
            }}
          >
            <UpperRightMenu
              setTabType={setTabType}
              globalSettings={globalSettings}
            />
          </div>
          {authContext.messagePopup && (
            <Message globalSettings={globalSettings} />
          )}
        </div>
      )}
    </div>
  );
}

export default Column;

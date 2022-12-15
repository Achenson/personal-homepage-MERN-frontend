import React, { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";

import SingleColor_Tab from "./SingleColor_Tab";

import { useTabContext } from "../../context/tabContext";

import { tabColors, tabColorsConcat } from "../../utils/data/colors_tab";

import { TabDatabase_i } from "../../utils/tabType";
import { GlobalSettingsState, SingleTabData } from "../../utils/interfaces";

interface Props {
  setIconsVis: (value: React.SetStateAction<boolean>) => void;
  tabID: string;
  tabColor: string | null;
  tabType: "folder" | "note" | "rss";
  globalSettings: GlobalSettingsState;
  currentTab: TabDatabase_i | SingleTabData;
  userIdOrNoId: string | null;
}

function ColorsToChoose_Tab({
  setIconsVis,
  tabID,
  tabColor,
  tabType,
  globalSettings,
  currentTab,
  userIdOrNoId,
}: Props): JSX.Element {
  const [selectedNumber, setSelectedNumber] = useState(calcSelectedNumber());

  const tabContext = useTabContext();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === "Escape") {
      tabContext.tabVisDispatch({ type: "COLORS_CLOSE" });
    }
  }

  function calcSelectedNumber(): number {
    let selectedNumber: number = 0;

    if (tabColor) {
      tabColorsConcat.forEach((color, i) => {
        if (color === tabColor) {
          selectedNumber = calcColorNumbering(color);
        }
      });
    }

    if (!tabColor) {
      if (tabType === "folder") {
        selectedNumber = calcColorNumbering(globalSettings.folderColor);
      }

      if (tabType === "note") {
        selectedNumber = calcColorNumbering(globalSettings.noteColor);
      }

      if (tabType === "rss") {
        selectedNumber = calcColorNumbering(globalSettings.rssColor);
      }
    }

    return selectedNumber;
  }

  function calcColorNumbering(color: string): number {
    // +1 because tabIndex for focus starts with one
    return tabColorsConcat.indexOf(color) + 1;
  }

  function mappingColors(colors: string[][]) {
    return tabColors.map((row, i) => {
      return (
        <div className="flex" key={i}>
          {row.map((el, j) => {
            return (
              <SingleColor_Tab
                color={el}
                tabID={tabID}
                tabColor={tabColor}
                selectedNumber={selectedNumber}
                tabType={tabType}
                key={j}
                colorNumber={calcColorNumbering(el)}
                setSelectedNumber={setSelectedNumber}
                colorArrLength={tabColorsConcat.length}
                currentTab={currentTab}
                userIdOrNoId={userIdOrNoId}
              />
            );
          })}
        </div>
      );
    });
  }

  return (
    <FocusLock>
      <div
        className={`absolute right-0 bg-gray-100 mr-px mt-px z-40`}
        onMouseEnter={() => {
          setIconsVis(true);
        }}
      >
        {mappingColors(tabColors)}
      </div>
    </FocusLock>
  );
}

export default ColorsToChoose_Tab;

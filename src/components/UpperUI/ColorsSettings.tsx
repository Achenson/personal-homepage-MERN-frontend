import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";

import Settings_inner from "./Settings_inner";
import ColorsToChoose_DefaultAndColumns from "../Colors/ColorsToChoose_DefaultAndColumns";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as RssSVG } from "../../svgs/rss.svg";

import { useResetColors } from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { tabColors } from "../../utils/data/colors_tab";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function ColorsSettings({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const [defaultColorsFor, setDefaultColorsFor] = useState<
    "folders" | "notes" | "rss" | "unselected"
  >("unselected");

  const [colorsToChooseVis, setColorsToChooseVis] = useState<boolean>(false);
  const [foldersSelected, setFoldersSelected] = useState<boolean>(false);
  const [notesSelected, setNotesSelected] = useState<boolean>(false);
  const [rssSelected, setRssSelected] = useState<boolean>(false);
  const setResetColors = useResetColors((store) => store.setResetColors);
  const setTabOpenedState = useTabs((store) => store.setTabOpenedState);
  const upperUiContext = useUpperUiContext();
  const windowSize = useWindowSize();
  const [xsScreen, setXsScreen] = useState(
    () => upperUiContext.upperVisState.xsSizing_initial
  );
  const focusOnFolders = useRef<HTMLButtonElement>(null);
  const focusOnNotes = useRef<HTMLButtonElement>(null);
  const focusOnRss = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < 505) {
        setXsScreen(true);
      } else {
        setXsScreen(false);
      }
    }
  }, [windowSize.width]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function focusOnTabColors(
    foldersSelected: boolean,
    notesSelected: boolean,
    rssSelected: boolean
  ) {
    if (foldersSelected) {
      focusOnFolders.current?.focus();
      return;
    }
    if (notesSelected) {
      focusOnNotes.current?.focus();
      return;
    }
    if (rssSelected) {
      focusOnRss.current?.focus();
      return;
    }
  }

  function calcBorderColor(defaultColor: string, folderTypeSelected: boolean) {
    if (
      [tabColors[0][5], tabColors[11][5]].indexOf(defaultColor) > -1 &&
      folderTypeSelected
    ) {
      return "blueGray-400";
    }

    return "black";
  }

  function calcColorLeft(
    defaultColorsFor: "folders" | "notes" | "rss" | "unselected",
    xsScreen: boolean
  ) {
    if (defaultColorsFor === "folders") {
      return xsScreen ? "82px" : "85px";
    }

    if (defaultColorsFor === "notes") {
      return xsScreen ? "93px" : "128px";
    }

    if (defaultColorsFor === "rss") {
      return xsScreen ? "101px" : "168px";
    }

    if (defaultColorsFor === "unselected") {
      return "0px";
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 6, undefined);
  }

  function deselectColorsSettings() {
    setFoldersSelected(false);
    setNotesSelected(false);
    setRssSelected(false);
  }

  return (
    <FocusLock>
      <div
        className="flex flex-col z-50 fixed h-full w-screen justify-center items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "COLORS_SETTINGS_TOGGLE" });
        }}
      >
        <div
          style={{ marginBottom: "263px" }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${globalSettings.uiColor} rounded-sm relative`}
            style={{
              width: xsScreen ? `350px` : `417px`,
              height: "200px",
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <Settings_inner
              currentSettings={"colors"}
              globalSettings={globalSettings}
            />
            <div className="absolute right-0 top-0 mt-1 mr-1 ">
              <button
                onClick={() => {
                  upperUiContext.upperVisDispatch({
                    type: "COLORS_SETTINGS_TOGGLE",
                  });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 6,
                  });
                }}
                className="h-5 w-5 focus-2-offset-dark"
                aria-label={"Close"}
              >
                <CancelSVG className="h-full w-full fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <p className="text-center">Default tab colors</p>
            <div className="flex justify-center mt-6">
              <div className="flex justify-start items-center mb-2 mt-2">
                <div className="h-6 w-6 xs:h-7 xs:w-7">
                  <FolderSVG className="w-full h-full" />
                </div>
                <button
                  ref={focusOnFolders}
                  onClick={() => {
                    setDefaultColorsFor("folders");
                    if (defaultColorsFor === "folders") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setNotesSelected(false);
                    setRssSelected(false);
                    setFoldersSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.folderColor
                  } cursor-pointer ${
                    foldersSelected ? "border-2" : "border"
                  } border-${calcBorderColor(
                    globalSettings.folderColor,
                    foldersSelected
                  )} hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default folders color menu"}
                ></button>
              </div>
              <div className="flex justify-start items-center mb-2 mt-2 mr-5 ml-6 xs:mr-3 xs:ml-4">
                <div className="h-5 w-5 xs:h-6 xs:w-6 mr-px mb-1 xs:mb-1">
                  <NoteSVG className="w-full h-full" />
                </div>
                <button
                  ref={focusOnNotes}
                  onClick={() => {
                    setDefaultColorsFor("notes");
                    if (defaultColorsFor === "notes") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setFoldersSelected(false);
                    setRssSelected(false);
                    setNotesSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.noteColor
                  } cursor-pointer ${
                    notesSelected ? "border-2" : "border"
                  }  border-${calcBorderColor(
                    globalSettings.noteColor,
                    notesSelected
                  )} hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default notes color menu"}
                ></button>
              </div>
              <div className="flex  justify-start items-center mb-2 mt-2">
                <div className="h-6 w-6 xs:h-7 xs:w-7 -mr-px">
                  <RssSVG className="w-full h-full" />
                </div>
                <button
                  ref={focusOnRss}
                  onClick={() => {
                    setDefaultColorsFor("rss");
                    if (defaultColorsFor === "rss") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setFoldersSelected(false);
                    setNotesSelected(false);
                    setRssSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.rssColor
                  } cursor-pointer ${
                    rssSelected ? "border-2" : "border"
                  }  border-${calcBorderColor(
                    globalSettings.rssColor,
                    rssSelected
                  )} hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default RSS color menu"}
                ></button>
              </div>
            </div>

            <p className={`text-center mt-4 xs:mt-3`}>
              {" "}
              <button
                onClick={() => {
                  setResetColors(true);
                  setTabOpenedState(null);
                }}
                className="focus-1-offset"
                aria-label={"Reset tabs to default colors"}
                disabled={colorsToChooseVis ? true : false}
              >
                <span
                  className={` ${
                    colorsToChooseVis
                      ? "cursor-default text-red-200"
                      : "hover:underline cursor-pointer text-red-600"
                  } 
              `}
                >
                  RESET
                </span>
              </button>{" "}
              <span
                className={`${
                  colorsToChooseVis ? "text-gray-200" : "text-black"
                }`}
              >
                tabs to default colors
              </span>
            </p>
            {colorsToChooseVis && (
              <div
                className="absolute"
                style={{
                  top: xsScreen ? "102px" : "106px",
                  left: calcColorLeft(defaultColorsFor, xsScreen),
                }}
              >
                <ColorsToChoose_DefaultAndColumns
                  defaultColorsFor={defaultColorsFor}
                  setColorsToChooseVis={setColorsToChooseVis}
                  globalSettings={globalSettings}
                  userIdOrNoId={userIdOrNoId}
                  deselectColorsSettings={deselectColorsSettings}
                  focusOnTabColors={focusOnTabColors}
                  foldersSelected={foldersSelected}
                  notesSelected={notesSelected}
                  rssSelected={rssSelected}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default ColorsSettings;

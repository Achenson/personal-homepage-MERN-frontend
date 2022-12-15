import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import UpperRightMenu_XS from "./UpperRightMenu_XS";

import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as BookmarkSVG } from "../../svgs/bookmarkAlt.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as CogSVG } from "../../svgs/cog.svg";
import { ReactComponent as UserSVG } from "../../svgs/user.svg";
import { ReactComponent as LoginSVG } from "../../svgs/login.svg";
import { ReactComponent as AddRssSVG } from "../../svgs/rss.svg";

import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useAuth } from "../../state/hooks/useAuth";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: GlobalSettingsState;
}

function UpperRightMenu({ setTabType, globalSettings }: Props): JSX.Element {
  let navigate = useNavigate();

  const colLimit = globalSettings.limitColGrowth;
  const uiColor = globalSettings.uiColor;

  const setFocusedTabState = useTabs((store) => store.setFocusedTabState);
  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();

  let focusOnUpperRightUi_ref_1 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_2 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_3 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_4 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_5 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_6 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (
      focusOnUpperRightUi_ref_1.current !== null &&
      focusOnUpperRightUi_ref_2.current !== null &&
      focusOnUpperRightUi_ref_3.current !== null &&
      focusOnUpperRightUi_ref_4.current !== null &&
      focusOnUpperRightUi_ref_5.current !== null &&
      focusOnUpperRightUi_ref_6.current !== null &&
      upperUiContext.upperVisState.focusOnUpperRightUi
    ) {
      switch (upperUiContext.upperVisState.focusOnUpperRightUi) {
        case 1:
          focusOnUpperRightUi_ref_1.current.focus();
          return;
        case 2:
          focusOnUpperRightUi_ref_2.current.focus();
          return;
        case 3:
          focusOnUpperRightUi_ref_3.current.focus();
          return;
        case 4:
          focusOnUpperRightUi_ref_4.current.focus();
          return;
        case 5:
          focusOnUpperRightUi_ref_5.current.focus();
          return;
        case 6:
          focusOnUpperRightUi_ref_6.current.focus();
          return;
      }
    }

    upperUiContext.upperVisDispatch({
      type: "FOCUS_ON_UPPER_RIGHT_UI",
      payload: null,
    });
  }, [upperUiContext.upperVisState.focusOnUpperRightUi]);

  // xs or normal display depending on numberOfCols && col width limit
  function xsDisplay(str_1: string, str_2: string) {
    if (colLimit) {
      // setting always in xs mode in case of colLimit && numberOfCols === 1
      if (globalSettings.numberOfCols === 1) return "";
      return str_1;
    }
    return str_2;
  }

  return (
    <div
      onFocus={() => {
        setFocusedTabState(null);
      }}
      className={`${upperUiContext.upperVisState.addTabVis_xs ? "h-14" : "h-7"}
        ${xsDisplay("sm:h-7", "xs:h-7")}
      w-28 ${xsDisplay("sm:w-full", "xs:w-full")} ${xsDisplay(
        "sm:flex",
        "xs:flex"
      )}  justify-between items-center bg-white bg-opacity-80 rounded-md border border-gray-700 `}
      style={{ marginBottom: "2px" }}
    >
      <div
        className={`hidden ${xsDisplay("sm:flex", "xs:flex")} justify-between`}
      >
        <button
          ref={focusOnUpperRightUi_ref_1}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
          }}
          tabIndex={7}
          aria-label={"New bookmark"}
        >
          <BookmarkSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_2}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("folder");
          }}
          tabIndex={8}
          aria-label={"New folder"}
        >
          <FolderSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor} -ml-px`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_3}
          className="h-6 w-6 focus-2-veryDark"
          style={{ marginTop: "2px" }}
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("note");
          }}
          tabIndex={9}
          aria-label={"New note"}
        >
          <NoteSVG
            className={`h-6 w-6 cursor-pointer fill-current transition-colors duration-75 text-black hover:text-${uiColor}`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_4}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("rss");
          }}
          tabIndex={10}
          aria-label={"New RSS channel"}
        >
          <AddRssSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>
      </div>
      {/* XS============================== */}
      <UpperRightMenu_XS
        setTabType={setTabType}
        globalSettings={globalSettings}
      />
      {/* xs ============================^ */}
      <div className={`w-3`}></div>

      <div
        className={`hidden ${xsDisplay(
          "sm:flex",
          "xs:flex"
        )} justify-end items-center mr-0.5`}
      >
        <button
          ref={focusOnUpperRightUi_ref_5}
          className="h-6 w-6 mr-px focus-2-veryDark"
          onClick={() => {
            switch (upperUiContext.upperVisState.currentXSsettings) {
              case "background":
                upperUiContext.upperVisDispatch({
                  type: "BACKGROUND_SETTINGS_TOGGLE",
                });
                return;
              case "colors":
                upperUiContext.upperVisDispatch({
                  type: "COLORS_SETTINGS_TOGGLE",
                });
                return;
              case "global":
                upperUiContext.upperVisDispatch({ type: "SETTINGS_TOGGLE" });
                return;
              default:
                upperUiContext.upperVisDispatch({
                  type: "COLORS_SETTINGS_TOGGLE",
                });
            }
          }}
          tabIndex={13}
          aria-label={"Global settings"}
        >
          <CogSVG
            className={`h-full w-full cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>

        <div style={{ width: "24px", height: "24px" }}>
          {authContext.isAuthenticated ? (
            <button
              ref={focusOnUpperRightUi_ref_6}
              className="h-6 w-6 focus-2-inset-veryDark"
              onClick={() => {
                navigate("/user-profile");
              }}
              tabIndex={14}
              aria-label={"User profile"}
            >
              <UserSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "-2px" }}
              />
            </button>
          ) : (
            <button
              ref={focusOnUpperRightUi_ref_6}
              className="h-6 w-5 focus-2-veryDark"
              onClick={() => {
                navigate("/login-register");
              }}
              tabIndex={14}
              aria-label={"Login/register"}
            >
              <LoginSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "0px", marginBottom: "0px" }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpperRightMenu;

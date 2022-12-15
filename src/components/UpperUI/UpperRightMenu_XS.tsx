import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as PlusSmSVG } from "../../svgs/plus-sm.svg";
import { ReactComponent as BookmarkSVG } from "../../svgs/bookmarkAlt.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as CogSVG } from "../../svgs/cog.svg";
import { ReactComponent as UserSVG } from "../../svgs/user.svg";
import { ReactComponent as LoginSVG } from "../../svgs/login.svg";
import { ReactComponent as AddRssSVG } from "../../svgs/rss.svg";

import { useUpperUiContext } from "../../context/upperUiContext";
import { useAuth } from "../../state/hooks/useAuth";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: GlobalSettingsState;
}

function UpperRightMenu({ setTabType, globalSettings }: Props): JSX.Element {
  let navigate = useNavigate();

  const uiColor = globalSettings.uiColor;
  const colLimit = globalSettings.limitColGrowth;

  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();

  let focusOnUpperRightUi_xs_ref_1 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_2 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_3 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_4 = useRef<HTMLButtonElement>(null);
  // no ref 6 & 7 in UpperRightMenu_XS as there is only one SVG for all settings
  let focusOnUpperRightUi_xs_ref_5 = useRef<HTMLButtonElement>(null);
  // let focusOnUpperRightUi_xs_ref_8 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_6 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (
      focusOnUpperRightUi_xs_ref_1.current !== null &&
      focusOnUpperRightUi_xs_ref_5.current !== null &&
      // focusOnUpperRightUi_xs_ref_8.current !== null &&
      focusOnUpperRightUi_xs_ref_5.current !== null &&
      upperUiContext.upperVisState.focusOnUpperRightUi
    ) {
      switch (upperUiContext.upperVisState.focusOnUpperRightUi) {
        case 1:
          if (focusOnUpperRightUi_xs_ref_1.current) {
            focusOnUpperRightUi_xs_ref_1.current.focus();
          }
          return;
        case 2:
          if (focusOnUpperRightUi_xs_ref_2.current) {
            focusOnUpperRightUi_xs_ref_2.current.focus();
          }
          return;
        case 3:
          if (focusOnUpperRightUi_xs_ref_3.current) {
            focusOnUpperRightUi_xs_ref_3.current.focus();
          }
          return;
        case 4:
          if (focusOnUpperRightUi_xs_ref_4.current) {
            focusOnUpperRightUi_xs_ref_4.current.focus();
          }
          return;
        case 5:
          focusOnUpperRightUi_xs_ref_5.current.focus();
          return;
        case 6:
          (focusOnUpperRightUi_xs_ref_6.current as HTMLButtonElement).focus();
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
    <>
      {upperUiContext.upperVisState.addTabVis_xs && (
        <div
          className={`flex ${xsDisplay(
            "sm:hidden",
            "xs:hidden"
          )} justify-around`}
        >
          <button
            ref={focusOnUpperRightUi_xs_ref_1}
            className="h-7 w-7 focus-2-inset-veryDark"
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
            }}
            tabIndex={6}
            aria-label={"New bookmark"}
          >
            <BookmarkSVG
              className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
            />
          </button>
          <button
            ref={focusOnUpperRightUi_xs_ref_2}
            className="h-7 w-7 focus-2-inset-veryDark"
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("folder");
            }}
            tabIndex={7}
            aria-label={"New folder"}
          >
            <FolderSVG
              className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
              style={{ marginLeft: "-1px" }}
            />
          </button>
          <button
            ref={focusOnUpperRightUi_xs_ref_3}
            className="h-6 w-6 focus-2-veryDark"
            style={{ marginTop: "2px", marginLeft: "0px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("note");
            }}
            tabIndex={8}
            aria-label={"New note"}
          >
            <NoteSVG
              className={`h-6 w-6 cursor-pointer fill-current transition-colors duration-75 text-black hover:text-${uiColor}`}
            />
          </button>
          <button
            ref={focusOnUpperRightUi_xs_ref_4}
            className="h-7 w-7 focus-2-inset-veryDark"
            style={{ marginRight: "1px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("rss");
            }}
            tabIndex={9}
            aria-label={"New rss"}
          >
            <AddRssSVG
              className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
            />
          </button>
        </div>
      )}
      <div
        className={`flex items-center ${xsDisplay("sm:hidden", "xs:hidden")}`}
      >
        <div className="w-1/2 flex justify-start mt-px">
          <button
            className={`w-12 ml-1 flex justify-center items-center focus-2-inset-dark
            rounded border-black border-2 transition-colors duration-75 hover:text-${uiColor} hover:border-${uiColor}`}
            style={{ height: "22px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "ADD_TAB_XS_TOGGLE" });
            }}
            tabIndex={10}
            aria-label={"New tab menu"}
          >
            <PlusSmSVG
              className={`h-5 w-5 cursor-pointer  fill-current ml-px`}
            />
          </button>
        </div>

        <div className="flex justify-between w-1/2 items-center mt-px">
          <button
            ref={focusOnUpperRightUi_xs_ref_5}
            className="h-6 w-6 ml-px focus-2-veryDark"
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
            tabIndex={11}
            aria-label={"Settings"}
          >
            <CogSVG
              className={`h-full w-full cursor-pointer transition-colors duration-75  hover:text-${uiColor}`}
            />
          </button>
          <div className="mr-0.5" style={{ width: "24px", height: "24px" }}>
            {authContext.isAuthenticated ? (
              <button
                ref={focusOnUpperRightUi_xs_ref_6}
                className="h-6 w-5 focus-2-veryDark"
                style={{ width: "22px" }}
                onClick={() => {
                  navigate("/user-profile");
                }}
                tabIndex={12}
                aria-label={"User profile"}
              >
                <UserSVG
                  className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                  style={{ marginLeft: "-3px" }}
                />
              </button>
            ) : (
              <button
                ref={focusOnUpperRightUi_xs_ref_6}
                className="h-6 w-5 focus-2-veryDark"
                style={{ width: "18px" }}
                onClick={() => {
                  navigate("/login-register");
                }}
                tabIndex={12}
                aria-label={"Login/register"}
              >
                <LoginSVG
                  className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                  style={{ marginLeft: "-1px", marginBottom: "0px" }}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpperRightMenu;

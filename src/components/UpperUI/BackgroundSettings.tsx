import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FocusLock from "react-focus-lock";
import { useMutation, UseQueryState, OperationContext } from "urql";

import Settings_inner from "./Settings_inner";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import { ChangeSettingsMutation } from "../../graphql/graphqlMutations";

import {
  useGlobalSettings,
  UseGlobalSettingsAll,
} from "../../state/hooks/defaultSettingsHooks";
import { useUpperUiContext } from "../../context/upperUiContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";

import BackgroundSettings_Upload from "./BackgroundSettings_Upload";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  backgroundImgResults: UseQueryState<
    any,
    {
      userId: string | null;
    }
  >;
  reexecuteBackgroundImg: (
    opts?: Partial<OperationContext> | undefined
  ) => void;
  userIdOrNoId: string | null;
}

function BackgroundSettings({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  backgroundImgResults,
  reexecuteBackgroundImg,
  userIdOrNoId,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const setGlobalSettings = useGlobalSettings(
    (store) => store.setGlobalSettings
  );
  const uiColor = globalSettings.uiColor;
  const upperUiContext = useUpperUiContext();
  const windowSize = useWindowSize();
  const [xsScreen, setXsScreen] = useState(
    () => upperUiContext.upperVisState.xsSizing_initial
  );
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [dbFilesError, setDbFilesError] = useState<null | string>(null);

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

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    GlobalSettingsState
  >(ChangeSettingsMutation);

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 5, undefined);
  }

  let finalColorForImgBackgroundMode = uiColor;

  if (uiColor === "blueGray-400") {
    finalColorForImgBackgroundMode = "blueGray-700";
  }

  const imgDescription_1 = "Transparent colors for columns";
  const imgDescription_2a = "Use ";
  const imgDescription_2b = " or choose default:";
  const imgDescription_3 = "Choose default image:";
  const noImgDescription = "Full colors for background and columns";

  const renderChoseImage = (userIdOrNoId: string | null) => {
    if (!userIdOrNoId) {
      return <p className="block xs:inline-block">{imgDescription_3}</p>;
    }

    return (
      <p className="block xs:inline-block xs:mb-2">
        {imgDescription_2a}
        <button
          onClick={() => {
            if (!userIdOrNoId) {
              return;
            }

            if (!backgroundImgResults?.data?.backgroundImg?.backgroundImgUrl) {
              hiddenFileInput.current?.click();
              return;
            }

            changeSettings({
              ...globalSettings,
              defaultImage: "customBackground",
            });
          }}
          className="focus-1-offset"
          aria-label={"Custom image"}
        >
          <span className={`text-${uiColor} cursor-pointer hover:underline`}>
            custom image
          </span>
        </button>
        {imgDescription_2b}
      </p>
    );
  };

  const renderBrowseFiles = (
    userIdOrNoId: string | null,
    picBackground: boolean
  ) => {
    if (userIdOrNoId && globalSettings.picBackground) {
      return (
        <div className="mt-1 xs:mt-0">
          <BackgroundSettings_Upload
            xsScreen={xsScreen}
            globalSettings={globalSettings}
            backgroundImgResults={backgroundImgResults}
            reexecuteBackgroundImg={reexecuteBackgroundImg}
            hiddenFileInput={hiddenFileInput}
            setDbFilesError={setDbFilesError}
          />
        </div>
      );
    } else {
      if (!picBackground) {
        return null;
      }

      return (
        <p className="text-center mt-1 xs:mt-3">
          <button
            onClick={() => {
              navigate("/login-register");
            }}
            className="focus-1-offset"
            aria-label={"Authenticate"}
          >
            <span className={`text-${uiColor} cursor-pointer hover:underline`}>
              Authenticate
            </span>
          </button>
          <span> </span>
          to upload custom images
        </p>
      );
    }
  };

  return (
    <FocusLock>
      <div
        className="flex flex-col z-50 fixed h-full w-screen justify-center items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({
            type: "BACKGROUND_SETTINGS_TOGGLE",
          });
        }}
      >
        <div
          style={{ marginBottom: `${xsScreen ? "205px" : "238px"}` }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${uiColor} rounded-sm relative`}
            style={{
              width: `${xsScreen ? "350px" : "417px"}`,
              height: `${xsScreen ? "258px" : "225px"}`,
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <Settings_inner
              currentSettings={"background"}
              globalSettings={globalSettings}
            />
            <div className="absolute right-0 top-0 mt-1 mr-1">
              <button
                className="h-5 w-5 focus-2-offset-dark"
                onClick={() => {
                  upperUiContext.upperVisDispatch({
                    type: "BACKGROUND_SETTINGS_TOGGLE",
                  });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 5,
                  });
                }}
                aria-label={"Close"}
              >
                <CancelSVG className="h-full w-full fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <div className="mx-0 xs:mx-2">
              <p className="text-center mb-3">Background mode</p>
              <div className="mb-1 text-center">
                <span className="text-lg">Background image:</span>
                <button
                  className="ml-2 focus-1-offset"
                  onClick={() => {
                    if (!globalSettings.picBackground) {
                      userIdOrNoId
                        ? changeSettings({
                            ...globalSettings,
                            picBackground: true,
                          })
                        : setGlobalSettings({
                            ...globalSettings,
                            picBackground: true,
                          });
                    }
                  }}
                  aria-label={"Background image on"}
                >
                  <span
                    className={`${
                      globalSettings.picBackground
                        ? "cursor-default" +
                          " " +
                          "text-" +
                          finalColorForImgBackgroundMode
                        : "hover:text-opacity-50 cursor-pointer text-gray-400"
                    } text-lg`}
                  >
                    ON
                  </span>
                </button>
                <button
                  className="ml-1.5 focus-1-offset"
                  onClick={() => {
                    if (globalSettings.picBackground) {
                      userIdOrNoId
                        ? changeSettings({
                            ...globalSettings,
                            picBackground: false,
                          })
                        : setGlobalSettings({
                            ...globalSettings,
                            picBackground: false,
                          });
                    }
                  }}
                  aria-label={"Background image off"}
                >
                  <span
                    className={`${
                      globalSettings.picBackground
                        ? "hover:text-opacity-50 cursor-pointer text-gray-400"
                        : "cursor-default" +
                          " " +
                          "text-" +
                          finalColorForImgBackgroundMode
                    } text-lg`}
                  >
                    OFF
                  </span>
                </button>
              </div>

              {globalSettings.picBackground ? (
                <div className="text-center">
                  <p className={`mb-2 xs:mb-0`}>{imgDescription_1}</p>
                  <div className="mt-6  xs:mt-3  h-5 text-black text-center text-sm">
                    {userIdOrNoId ? dbFilesError : null}
                  </div>
                  <div className={`mt-0 xs:mt-0`}>
                    {renderChoseImage(userIdOrNoId)}
                    <span> </span>
                    <button
                      onClick={() => {
                        userIdOrNoId
                          ? changeSettings({
                              ...globalSettings,
                              defaultImage: "defaultBackground",
                            })
                          : setGlobalSettings({
                              ...globalSettings,
                              defaultImage: "defaultBackground",
                            });
                      }}
                      className="focus-1-offset"
                      aria-label={"Default background image one"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        1
                      </span>
                    </button>

                    <span> </span>
                    <button
                      onClick={() => {
                        userIdOrNoId
                          ? changeSettings({
                              ...globalSettings,
                              defaultImage: "defaultBackground_2",
                            })
                          : setGlobalSettings({
                              ...(globalSettings as UseGlobalSettingsAll),
                              defaultImage: "defaultBackground_2",
                            });
                      }}
                      className="focus-1-offset"
                      aria-label={"Default background image two"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        2
                      </span>
                    </button>
                    <span> </span>
                    <button
                      className="focus-1-offset"
                      onClick={() => {
                        userIdOrNoId
                          ? changeSettings({
                              ...globalSettings,
                              defaultImage: "defaultBackground_3",
                            })
                          : setGlobalSettings({
                              ...(globalSettings as UseGlobalSettingsAll),
                              defaultImage: "defaultBackground_3",
                            });
                      }}
                      aria-label={"Default background image three"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        3
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center mb-3">{noImgDescription}</p>
              )}
              {renderBrowseFiles(userIdOrNoId, globalSettings.picBackground)}
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default BackgroundSettings;

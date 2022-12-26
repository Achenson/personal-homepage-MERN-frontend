import React, { useEffect } from "react";
import { UseQueryState, OperationContext } from "urql";

import Grid from "./LowerUI/Grid";
import Bookmark_newAndEdit from "./Shared/Bookmark_newAndEdit";
import NewTab from "./UpperUI/NewTab";
import ColorsSettings from "./UpperUI/ColorsSettings";
import UpperUI from "./UpperUI/UpperUI";
import BackgroundSettings from "./UpperUI/BackgroundSettings";
import GlobalSettings from "./UpperUI/GlobalSettings";
import ModalWrap from "./UpperUI/ModalWrap";

import { useAuth } from "../state/hooks/useAuth";

import { GlobalSettingsState, UpperVisState } from "../utils/interfaces";

interface Props {
  globalSettings: GlobalSettingsState;
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  tabType: "folder" | "note" | "rss";
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  upperVisState: UpperVisState;
  paddingRight: boolean;
  userIdOrNoId: string | null;
  backgroundImgUrl: string | null;
  backgroundImgResults: UseQueryState<
    any,
    {
      userId: string | null;
    }
  >;
  reexecuteBackgroundImg: (
    opts?: Partial<OperationContext> | undefined
  ) => void;
}

function MainRoute({
  globalSettings,
  mainPaddingRight,
  scrollbarWidth,
  tabType,
  setTabType,
  upperVisState,
  paddingRight,
  userIdOrNoId,
  backgroundImgUrl,
  backgroundImgResults,
  reexecuteBackgroundImg,
}: Props): JSX.Element {
  const environment = process.env.NODE_ENV;

  const backgroundColor = globalSettings.backgroundColor;
  const setLoginNotification = useAuth((store) => store.setLoginNotification);

  useEffect(() => {
    setLoginNotification(null);
  }, [setLoginNotification]);

  let paddingProps = {
    mainPaddingRight,
    scrollbarWidth,
  };

  let authAndSettingsProps = {
    globalSettings,
    userIdOrNoId,
  };

  function renderBackgroundImg(picBackground: boolean, defaultImage: string) {
    // ===== logic for imgbb
    if (
      picBackground &&
      defaultImage === "customBackground" &&
      backgroundImgUrl === "No image url in the database"
    ) {
      return undefined
    }
    //  =====
    if (
      picBackground &&
      defaultImage === "customBackground" &&
      backgroundImgUrl
    ) {
      let parsedUrl: string;

      if (environment === "production") {
        // parsedUrl = "/" + backgroundImgUrl;
        parsedUrl = backgroundImgUrl;
      } else {
        parsedUrl = "http://localhost:4000/" + backgroundImgUrl;
      }
      return `url(${parsedUrl})`;
    }

    // ===== logic for imgbbb
    if (
      picBackground &&
      defaultImage === "customBackground" &&
      !backgroundImgUrl
    ) {

      setTimeout(
        () => reexecuteBackgroundImg({ requestPolicy: "network-only" }),
        1500
      );
    }
    // ======

    return undefined;
  }

  return (
    <main
      className={`relative min-h-screen
       ${
         globalSettings.picBackground
           ? `bg-${globalSettings.defaultImage}`
           : `bg-${backgroundColor}`
       }
        bg-cover bg-fixed`}
      style={{
        paddingRight: `${
          paddingRight && !globalSettings.picBackground
            ? `${scrollbarWidth}px`
            : ""
        }`,
        backgroundImage: renderBackgroundImg(
          globalSettings.picBackground,
          globalSettings.defaultImage
        ),
      }}
    >
      {upperVisState.newTabVis && (
        <ModalWrap globalSettings={globalSettings}>
          <NewTab
            tabType={tabType}
            {...paddingProps}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.newBookmarkVis && (
        <ModalWrap globalSettings={globalSettings}>
          <Bookmark_newAndEdit
            bookmarkComponentType={"new_upperUI"}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.backgroundSettingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <BackgroundSettings
            backgroundImgResults={backgroundImgResults}
            reexecuteBackgroundImg={reexecuteBackgroundImg}
            {...paddingProps}
            {...authAndSettingsProps}
          />
        </ModalWrap>
      )}
      {upperVisState.settingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <GlobalSettings {...paddingProps} {...authAndSettingsProps} />
        </ModalWrap>
      )}
      {upperVisState.colorsSettingsVis && (
        <ModalWrap globalSettings={globalSettings}>
          <ColorsSettings {...paddingProps} {...authAndSettingsProps} />
        </ModalWrap>
      )}
      <UpperUI />
      <Grid setTabType={setTabType} {...authAndSettingsProps} />
    </main>
  );
}

export default MainRoute;

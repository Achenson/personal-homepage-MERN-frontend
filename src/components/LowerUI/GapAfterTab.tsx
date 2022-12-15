import React from "react";
import { useMutation } from "urql";
import { useDrop } from "react-dnd";

import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { useTabBeingDraggedColor } from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useTabsDb } from "../../state/hooks/useTabsDb";

import { ItemTypes } from "../../utils/data/itemsDnd";
import { dragTabDb } from "../../utils/funcs and hooks/dragTabDb";

import { TabDatabase_i } from "../../utils/tabType";
import { GlobalSettingsState, SingleTabData } from "../../utils/interfaces";

interface Item {
  type: string;
  tabID: string;
  colNumber: number;
  tabColor: string;
}

interface Props {
  colNumber: number;
  tabID_orNull: string | null;
  picBackground: boolean;
  isThisLastGap: boolean;
  isThisTheOnlyGap: boolean;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
  tabIsDeletable: boolean | undefined;
}

function GapAfterTab({
  colNumber,
  tabID_orNull,
  isThisLastGap,
  isThisTheOnlyGap,
  globalSettings,
  userIdOrNoId,
  tabIsDeletable,
}: Props): JSX.Element {
  const tabsNotAuth = useTabs((store) => store.tabs);

  const tabsDb = useTabsDb((store) => store.tabsDb);

  let tabs: TabDatabase_i[] | SingleTabData[];

  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const tabBeingDraggedColor = useTabBeingDraggedColor(
    (store) => store.tabBeingDraggedColor
  );

  const dragTab = useTabs((store) => store.dragTab);

  const [{ isOver }, drop] = useDrop({
    //    required property
    accept: ItemTypes.BOOKMARK,
    drop: (item: Item, monitor) => {
      userIdOrNoId
        ? dragTabDb(
            item.tabID,
            item.colNumber,
            colNumber,
            tabID_orNull,
            false,
            tabs as TabDatabase_i[],
            editTab
          )
        : dragTab(item.tabID, item.colNumber, colNumber, tabID_orNull, false);
    },
    // drop: (item, monitor) => console.log(item.tabID),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  function calcOpacityOnDrop() {
    return `bg-${tabBeingDraggedColor} opacity-60`;
  }

  function upperLastGapBorderDrag(): string {
    if (isOver) {
      return calcOpacityOnDrop();
    }

    if (globalSettings.picBackground) {
      return "";
    }

    return `border-r border-l ${isThisTheOnlyGap ? "border-t" : ""}`;
  }

  return (
    <>
      {isThisLastGap ? (
        <div ref={drop} className="h-full relative flex flex-col">
          <div
            className={`h-6 ${
              globalSettings.picBackground
                ? ""
                : `border-black border-opacity-10 `
            }
            ${upperLastGapBorderDrag()} `}
          ></div>

          {/* 1px height to cover bottom of the column when draggind */}
          {!globalSettings.picBackground && (
            <div
              className={`absolute h-px w-full ${
                isOver ? calcOpacityOnDrop() : ""
              }`}
              style={{ top: "24px" }}
            ></div>
          )}

          <div
            className={`w-full flex-grow ${
              globalSettings.picBackground
                ? ""
                : `border-black border-opacity-10 border-l border-r border-b`
            }
            ${isOver ? "opacity-30 bg-blueGray-200" : ""}
          `}
            // style={{ height: "10000vh" }}
          ></div>
        </div>
      ) : (
        <div
          className={`
          ${globalSettings.hideNonDeletable && !tabIsDeletable ? "hidden" : ""}
          h-6 ${
            globalSettings.picBackground
              ? ""
              : `border-black border-opacity-10 border-l border-r`
          } ${isOver ? calcOpacityOnDrop() : ""}
     
     `}
          ref={drop}
        ></div>
      )}
    </>
  );
}

export default GapAfterTab;

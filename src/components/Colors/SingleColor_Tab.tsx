import React from "react";
import { useMutation } from "urql";

import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { useTabs } from "../../state/hooks/useTabs";

import { tabColorsLightFocus } from "../../utils/data/colors_tab";

import { TabDatabase_i } from "../../utils/tabType";
import { SingleTabData } from "../../utils/interfaces";

interface Props {
  color: string;
  tabID: string;
  tabColor: string | null;
  tabType: "folder" | "note" | "rss";
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
  currentTab: TabDatabase_i | SingleTabData;
  userIdOrNoId: string | null;
}

function SingleColor_Tab({
  color,
  tabID,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
  currentTab,
  userIdOrNoId,
}: Props): JSX.Element {
  const setTabColor = useTabs((store) => store.setTabColor);

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  let tabIndex = calcTabIndex();

  function calcTabIndex() {
    let indexToReturn = colorNumber - selectedNumber + 1;
    if (indexToReturn >= 1) {
      return indexToReturn;
    }

    return colorArrLength - selectedNumber + colorNumber + 1;
  }

  function focusColor(): string {
    if (tabColorsLightFocus.indexOf(color) > -1) {
      return "gray-400";
    }

    return "gray-500";
  }

  return (
    <button
      className={`h-4 w-8 -mr-px -mt-px bg-${color} cursor-pointer ${
        colorNumber === selectedNumber
          ? "border-2 border-white z-50"
          : "border border-black"
      } hover:border-2 hover:border-gray-500 hover:z-50
      focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset
      `}
      onClick={() => {
        userIdOrNoId
        // @ts-ignore
          ? editTab({ ...(currentTab as TabDatabase_i), color: color })
          : setTabColor(color, tabID);

        setSelectedNumber(colorNumber);
      }}
      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_Tab;

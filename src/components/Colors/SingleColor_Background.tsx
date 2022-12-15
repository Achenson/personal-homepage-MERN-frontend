import React from "react";
import { useMutation } from "urql";

import { ChangeSettingsMutation } from "../../graphql/graphqlMutations";

import { backgroundColorsLightFocus } from "../../utils/data/colors_background";

import {
  useGlobalSettings,
  UseGlobalSettingsAll,
} from "../../state/hooks/defaultSettingsHooks";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  color: string;
  colorCol: number;
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function SingleColor_Background({
  color,
  colorCol,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {

  const setGlobalSettings = useGlobalSettings(
    (store) => store.setGlobalSettings
  );

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    GlobalSettingsState
  >(ChangeSettingsMutation);

  function borderMaker() {
    if (colorNumber !== selectedNumber) {
      return "border border-black";
    }

    return `border-2 z-20 ${
      [6, 7, 8, 9].indexOf(colorCol) > -1 ? "border-gray-100" : "border-black"
    }`;
  }

  function focusColor(): string {
    if (backgroundColorsLightFocus.indexOf(color) > -1) {
      return "gray-400";
    }
    return "gray-500";
  }

  let tabIndex = calcTabIndex();

  function calcTabIndex() {
    let indexToReturn = colorNumber - selectedNumber + 1;

    if (indexToReturn >= 1) {
      return indexToReturn;
    }

    return colorArrLength - selectedNumber + colorNumber + 1;
  }

  return (
    <button
      className={`h-4 w-4 -mr-px -mt-px bg-${color} cursor-pointer
      ${borderMaker()}
      hover:border-2 hover:border-gray-500 hover:z-50 
      focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset
      `}
      onClick={() => {
        userIdOrNoId
          ? changeSettings({
              ...globalSettings,
              backgroundColor: color,
            })
          : setGlobalSettings({
              ...(globalSettings as UseGlobalSettingsAll),
              backgroundColor: color,
            });

        setSelectedNumber(colorNumber);
      }}
      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_Background;

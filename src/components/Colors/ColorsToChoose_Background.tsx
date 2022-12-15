import React, { useEffect, useState, useCallback } from "react";
import FocusLock from "react-focus-lock";

import SingleColor_Background from "./SingleColor_Background";

import { useUpperUiContext } from "../../context/upperUiContext";

import {
  backgroundColors,
  backgroundColorsConcat,
} from "../../utils/data/colors_background";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  setFocusOnBackgroundColor: React.Dispatch<React.SetStateAction<boolean>>;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function ColorsToChoose_Background({
  setFocusOnBackgroundColor,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const backgroundColor = globalSettings.backgroundColor;

  const calcSelectedNumber = useCallback((): number => {
    let selectedNumber: number = 0;

    backgroundColorsConcat.forEach((color, i) => {
      if (color === backgroundColor) {
        selectedNumber = calcColorNumbering(color);
      }
    });

    return selectedNumber;
  }, [backgroundColor]);

  const [selectedNumber, setSelectedNumber] = useState(calcSelectedNumber());

  const upperUiContext = useUpperUiContext();

  useEffect(() => {
    setSelectedNumber(calcSelectedNumber());
  }, [backgroundColor, calcSelectedNumber]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === "Escape") {
      if (upperUiContext.upperVisState.colorsBackgroundVis) {
        upperUiContext.upperVisDispatch({ type: "COLORS_BACKGROUND_TOGGLE" });
      }
      if (setFocusOnBackgroundColor) {
        setFocusOnBackgroundColor(true);
      }
    }
  }

  function calcColorNumbering(color: string): number {
    // +1 because tabIndex for focus starts with one
    return backgroundColorsConcat.indexOf(color) + 1;
  }

  function mapBackgroundColors() {
    return backgroundColors.map((row, i) => {
      return (
        <div className="flex" key={i}>
          {row.map((el, j) => {
            return (
              <SingleColor_Background
                color={el}
                key={j}
                colorCol={j}
                colorArrLength={backgroundColorsConcat.length}
                colorNumber={calcColorNumbering(el)}
                selectedNumber={selectedNumber}
                setSelectedNumber={setSelectedNumber}
                globalSettings={globalSettings}
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
      <div className="z-50 relative" style={{ bottom: "104px", left: "240px" }}>
        <div
          className="absolute bg-white"
          style={{ right: "84px", top: "135px" }}
        >
          {mapBackgroundColors()}
        </div>
      </div>
    </FocusLock>
  );
}

export default ColorsToChoose_Background;

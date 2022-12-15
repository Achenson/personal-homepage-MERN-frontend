import React, { useState, useEffect } from "react";

interface Props {
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  visibleSelectables: string[];
  marginTop: string;
  setWasAnythingClicked?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectablesVis: React.Dispatch<React.SetStateAction<boolean>>;
  initialSelectables: string[];
}

function SelectableList({
  setSelectablesInputStr,
  selectablesInputStr,
  visibleSelectables,
  marginTop,
  setWasAnythingClicked,
  setSelectablesVis,
  initialSelectables,
}: Props): JSX.Element {
  let visibleSelectables_sorted = visibleSelectables.sort();

  const [selectableToHighlight, setSelectableToHighlight] = useState<
    null | number
  >(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown_selectables);

    // !!!! without this everything will be recalculated from start - lag
    return () => {
      document.removeEventListener("keydown", handleKeyDown_selectables);
    };
  });

  function handleKeyDown_selectables(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
        highlightHigher();
        return;
      case "ArrowDown":
        highlightLower();
        return;
      case "Enter":
        if (selectableToHighlight !== null) {
          chooseCurrent(
            visibleSelectables_sorted[selectableToHighlight],
            "keyboard"
          );
        }
        return;
      case "NumpadEnter":
        if (selectableToHighlight !== null) {
          chooseCurrent(
            visibleSelectables_sorted[selectableToHighlight],
            "keyboard"
          );
        }
        return;
      case "Delete":
        setSelectablesInputStr("");
        return;
      case "Tab":
        setSelectablesVis(false);
        return;
      case "Escape":
        setSelectablesVis(false);
        return;

      default:
        return;
    }

    function highlightHigher() {
      if (visibleSelectables_sorted.length === 0) {
        return;
      }

      if (selectableToHighlight === null) {
        setSelectableToHighlight(0);
        return;
      }

      if (selectableToHighlight === 0) {
        setSelectableToHighlight(visibleSelectables_sorted.length - 1);
        return;
      }

      setSelectableToHighlight((nr) => (nr as number) - 1);
    }

    function highlightLower() {
      if (visibleSelectables_sorted.length === 0) {
        return;
      }

      if (selectableToHighlight === null) {
        setSelectableToHighlight(0);
        return;
      }

      if (selectableToHighlight === visibleSelectables_sorted.length - 1) {
        setSelectableToHighlight(0);
        return;
      }

      setSelectableToHighlight((nr) => (nr as number) + 1);
    }
  }

  function chooseCurrent(el: string, eventType: "mouse" | "keyboard") {
    if (visibleSelectables_sorted.length === 0) {
      return;
    }

    if (setWasAnythingClicked) {
      (setWasAnythingClicked as React.Dispatch<React.SetStateAction<boolean>>)(
        true
      );
    }

    concatToTheEnd();

    if (eventType === "keyboard") {
      // return if the array will be empty on the next render
      if (visibleSelectables_sorted.length === 1) {
        return;
      }

      // if the array will be shorter on the next render, highlight last item in the array
      if (selectableToHighlight === visibleSelectables_sorted.length - 1) {
        setSelectableToHighlight((nr) => (nr as number) - 1);
      }
    }

    function concatToTheEnd() {
      if (selectablesInputStr.length === 0) {
        setSelectablesInputStr(el);
        return;
      }

      let lastChar = selectablesInputStr[selectablesInputStr.length - 1];

      if (lastChar === ",") {
        setSelectablesInputStr(selectablesInputStr.concat(" " + el));
        return;
      }

      if (lastChar === " ") {
        setSelectablesInputStr(selectablesInputStr.concat(el));
        return;
      }

      let selectableArr = selectablesInputStr.split(", ");

      if (
        initialSelectables.indexOf(selectableArr[selectableArr.length - 1]) > -1
      ) {
        setSelectablesInputStr(selectablesInputStr.concat(", " + el));
        return;
      }

      selectableArr.pop();
      selectableArr.push(el);

      setSelectablesInputStr(selectableArr.join(", "));
    }
  }

  return (
    <div
      className="absolute z-50 bg-white w-full border border-t-0"
      style={{ marginTop: marginTop }}
    >
      {visibleSelectables_sorted.length === 0 ? (
        <p className="invisible">[empty]</p>
      ) : (
        visibleSelectables_sorted.map((el, i) => {
          return (
            <p
              className={`cursor-pointer ${
                selectableToHighlight === i ? "bg-blueGray-200" : ""
              }  pl-px truncate`}
              onClick={() => {
                chooseCurrent(el, "mouse");
              }}
              onMouseEnter={() => {
                setSelectableToHighlight(i);
              }}
              onMouseLeave={() => {
                setSelectableToHighlight(null);
              }}
              key={i}
            >
              {el}
            </p>
          );
        })
      )}
    </div>
  );
}

export default SelectableList;

import React, { useState, useEffect, useRef, useCallback } from "react";

import SelectableList from "../Shared/SelectableList";

import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { createSelectablesRegex } from "../../utils/regex";

import { SingleBookmarkData } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../utils/bookmarkType";

interface Props {
  selectablesListVis: boolean;
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>;
  wasAnythingClicked: boolean;
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  saveFunc: () => void;
  userIdOrNoId: string | null;
}

function EditTab_folder({
  selectablesListVis,
  setSelectablesListVis,
  wasAnythingClicked,
  setWasAnythingClicked,
  selectablesInputStr,
  setSelectablesInputStr,
  saveFunc,
  userIdOrNoId,
}: Props): JSX.Element {
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];

  bookmarks = userIdOrNoId

    ? (bookmarksDb as  BookmarkDatabase_i[])
    : bookmarksNotAuth;

  let selectablesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [initialBookmarks, setInitialBookmarks] = useState(() =>
    makeInitialBookmarks()
  );

  const [visibleBookmarks, setVisibleBookmarks] = useState<string[]>(() =>
    makeInitialBookmarks()
  );

  const shouldSelectableBeVisible = useCallback(
    (
      initialTagOrBookmark: string,
      selectablesInputStr: string,
      lastSelectablesArrEl: string
    ) => {
      if (selectablesInputStr.length === 0) {
        return true;
      }
      // when typing last word -> filter out non matching words
      if (!letterToLetterMatch(lastSelectablesArrEl, initialTagOrBookmark)) {
        return false;
      }
      // if there is no match for a selectable surrounded only be characters that cannot flank a title
      //  (spaces, commas)  ), -> selectable not visible
      if (
        createSelectablesRegex(initialTagOrBookmark).test(selectablesInputStr)
      ) {
        return false;
      }
      // selectable is visible in case the title is flanked by legal title character -
      // in that case the title is treated as a separate entity
      return true;

      function letterToLetterMatch(lastInput: string, el: string) {
        for (let i = 0; i < lastInput.length; i++) {
          if (
            lastInput[i] !== el[i] &&
            // returns true if lastInput is present in initial bookmarks
            initialBookmarks.indexOf(lastInput) === -1 &&
            // returns true is last char is a comma
            selectablesInputStr[selectablesInputStr.length - 1] !== ","
          ) {
            return false;
          }
        }
        return true;
      }
    },
    [initialBookmarks, selectablesInputStr]
  );

  useEffect(() => {
    let newVisibleBookmarks: string[] = [];

    let selectablesInputArr = selectablesInputStr.split(", ");

    let lastSelectablesArrEl =
      selectablesInputArr[selectablesInputArr.length - 1];

    initialBookmarks.forEach((el) => {
      if (
        shouldSelectableBeVisible(el, selectablesInputStr, lastSelectablesArrEl)
      ) {
        newVisibleBookmarks.push(el);
      }
    });

    setVisibleBookmarks([...newVisibleBookmarks]);

    if (newVisibleBookmarks.length === 0) {
      setSelectablesListVis(false);
    }
  }, [
    selectablesInputStr,
    initialBookmarks,
    setVisibleBookmarks,
    setSelectablesListVis,
    shouldSelectableBeVisible,
  ]);

  function makeInitialBookmarks(): string[] {
    let bookmarksInitial: string[] = [];

    bookmarks.forEach((obj) => {
      // @ts-ignore
      bookmarksInitial.push(obj.title);
    });

    return bookmarksInitial;
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_inner(
      event,
      event.code,
      selectablesListVis,
      setSelectablesListVis,
      setSelectablesInputStr,
      selectablesRef
    );
  }

  return (
    /* bookmarks not visible for tab with ALL Bookmarks */
    <div className="flex items-center mt-2 justify-between">
      <p className={`flex-none`} style={{ width: "87px" }}>
        Bookmarks
      </p>
      <div className="relative w-full">
        <div className={`relative`}>
          <input
            type="text"
            // min-w-0 !! ??
            className={`border pl-px w-full ${
              selectablesInputStr.length !== 0 ? "pr-9" : ""
            } focus-1 ${
              selectablesInputStr.length === 0 ? "text-sm" : "text-base"
            }`}
            style={{ height: "26px" }}
            ref={selectablesRef}
            value={selectablesInputStr}
            onChange={(e) => {
              setWasAnythingClicked(true);
              if (!selectablesListVis) setSelectablesListVis(true);

              let target = e.target.value;

              setSelectablesInputStr(target);
            }}
            onFocus={(e) => {
              setSelectablesListVis(true);
            }}
            placeholder={"Choose at least one"}
          />
          {selectablesInputStr.length !== 0 && (
            <span
              className="flex absolute h-4 bg-white z-50"
              style={{ top: "7px", right: "2px" }}
            >
              <CheckSVG
                className={`h-full  ${
                  wasAnythingClicked
                    ? "text-gray-500 cursor-pointer hover:text-opacity-60"
                    : "text-gray-300 cursor-default"
                }`}
                onClick={() => {
                  if (wasAnythingClicked) {
                    saveFunc();
                  }
                }}
              />
              <XsmallSVG
                className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                onClick={() => {
                  setSelectablesInputStr("");
                  setWasAnythingClicked(true);
                }}
              />
            </span>
          )}
        </div>

        {selectablesListVis && (
          <SelectableList
            setSelectablesInputStr={setSelectablesInputStr}
            selectablesInputStr={selectablesInputStr}
            visibleSelectables={visibleBookmarks}
            setSelectablesVis={setSelectablesListVis}
            initialSelectables={initialBookmarks}
            marginTop="0px"
            setWasAnythingClicked={setWasAnythingClicked}
          />
        )}
      </div>

      <div
        style={{ height: "18px", width: "18px" }}
        className=" mt-0.5 flex-none -mr-1"
      >
        {selectablesListVis ? (
          <ChevronUpSVG
            className="h-full cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
            onClick={() => {
              setSelectablesListVis((b) => !b);
            }}
          />
        ) : (
          <ChevronDownSVG
            className="h-full cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
            onClick={() => {
              setSelectablesListVis((b) => !b);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default EditTab_folder;

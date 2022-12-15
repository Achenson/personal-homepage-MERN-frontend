import { useReducer } from "react";

import { TabVisAction, TabVisState } from "../utils/interfaces";

export function useTabReducer(
  tabID: string,
  setTabOpenedState: (nullOrID: string | null) => void,
  setReset: (trueOrFalse: boolean) => void,
): [TabVisState, React.Dispatch<TabVisAction>] {
  const initVisState: TabVisState = {
    editTabVis: false,
    colorsVis: false,
    newBookmarkVis: false,
    editBookmarkVis: null,
    touchScreenModeOn: false,
  };

  const [tabVisState, tabVisDispatch] = useReducer(tabVisReducer, initVisState);

  function tabVisReducer(
    state: TabVisState,
    action: TabVisAction
  ): TabVisState {
    switch (action.type) {
      case "COLORS_SETTINGS_TOGGLE":
        if (!state.colorsVis) {
          setTimeout(() => {
            setReset(true);
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
          colorsVis: !state.colorsVis,
        };
      case "COLORS_CLOSE":
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
        };
      case "EDIT_TOGGLE":
        if (!state.editTabVis) {
          setTimeout(() => {
            setReset(true);
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          colorsVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
          editTabVis: !state.editTabVis,
        };

      // for opening note tab along with edit window
      case "EDIT_TOGGLE_NOTE_OPEN":
        if (!state.editTabVis) {
          setTimeout(() => {
            setReset(true);
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          colorsVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
          editTabVis: !state.editTabVis,
        };
      case "EDIT_CLOSE":
        return {
          ...state,
          editTabVis: false,
          colorsVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
        };
      case "TAB_CONTENT_TOGGLE":
        setTimeout(() => {
          setTabOpenedState(tabID);
        });
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
        };
      case "TAB_CONTENT_OPEN_AFTER_LOCKING":
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
        };
      case "TAB_EDITABLES_CLOSE":
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
          touchScreenModeOn: false,
        };
      case "NEW_BOOKMARK_TOOGLE":
        if (!state.newBookmarkVis) {
          setTimeout(() => {
            setReset(true);
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          editBookmarkVis: null,
          newBookmarkVis: !state.newBookmarkVis,
        };
      case "EDIT_BOOKMARK_OPEN":
        if (!state.editBookmarkVis) {
          setTimeout(() => {
            setReset(true);
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: action.payload,
        };
      case "EDIT_BOOKMARK_CLOSE":
        return {
          ...state,
          colorsVis: false,
          editTabVis: false,
          newBookmarkVis: false,
          editBookmarkVis: null,
        };
      case "TOUCH_SCREEN_MODE_ON":
        if (!state.touchScreenModeOn) {
          setTimeout(() => {
            setTabOpenedState(tabID);
          });
        }
        return {
          ...state,
          touchScreenModeOn: true,
        };
      default:
        return state;
    }
  }

  return [tabVisState, tabVisDispatch];
}

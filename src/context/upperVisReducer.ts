import { UpperVisAction, UpperVisState } from "../utils/interfaces";

import { initUpperVisState } from "./upperVisInitState";

export function upperVisReducer(
  state: UpperVisState,
  action: UpperVisAction
): UpperVisState {
  let upperVisStateMostlyFalse: UpperVisState = {
    ...initUpperVisState,
    addTabVis_xs: state.addTabVis_xs,
    xsSizing_initial: state.xsSizing_initial,
    currentXSsettings: state.currentXSsettings,
  };

  switch (action.type) {
    case "BACKGROUND_SETTINGS_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        backgroundSettingsVis: !state.backgroundSettingsVis,
      };
    case "COLORS_SETTINGS_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        colorsSettingsVis: !state.colorsSettingsVis,
      };
    case "NEW_BOOKMARK_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        newBookmarkVis: !state.newBookmarkVis,
      };
    case "NEW_TAB_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        newTabVis: !state.newTabVis,
      };
    case "SETTINGS_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        settingsVis: !state.settingsVis,
      };
    case "COLORS_BACKGROUND_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        colorsBackgroundVis: !state.colorsBackgroundVis,
        tabEditablesOpenable: false,
      };
    case "COLORS_COLUMN_TOGGLE":
      return {
        ...upperVisStateMostlyFalse,
        colorsColumnVis: !state.colorsColumnVis,
      };
    case "COLORS_COLUMN_OPEN":
      return {
        ...upperVisStateMostlyFalse,
        columnSelected: action.payload,
        colorsColumnVis: true,
      };
    case "ADD_TAB_XS_TOGGLE":
      return {
        ...state,
        addTabVis_xs: !state.addTabVis_xs,
      };
    case "XS_SIZING_TRUE":
      return {
        ...state,
        xsSizing_initial: true,
      };
    case "XS_SIZING_FALSE":
      return {
        ...state,
        xsSizing_initial: false,
      };
    case "CURRENT_XS_SETTINGS_BACKGROUND":
      return {
        ...upperVisStateMostlyFalse,
        currentXSsettings: "background",
        backgroundSettingsVis: true,
      };
    case "CURRENT_XS_SETTINGS_COLORS":
      return {
        ...upperVisStateMostlyFalse,
        currentXSsettings: "colors",
        colorsSettingsVis: true,
      };
    case "CURRENT_XS_SETTINGS_GLOBAL":
      return {
        ...upperVisStateMostlyFalse,
        currentXSsettings: "global",
        settingsVis: true,
      };
      
   /* ! tabEditablesOpenable -to solve the problem with tabEditables flickering when closing
       which is visible when backgroundColor modal overlap with tabEditables. More info note #143 */
    case "TAB_EDITABLES_OPENABLE_DEFAULT":
      return {
        ...state,
        tabEditablesOpenable: true,
      };
    case "FOCUS_ON_UPPER_RIGHT_UI": {
      return {
        ...state,
        focusOnUpperRightUi: action.payload
      }
    }
    // mostly false -> size sizing settings remain the same
    case "CLOSE_ALL":
      return {
        ...upperVisStateMostlyFalse,
      };

    default:
      return { ...upperVisStateMostlyFalse };
  }
}

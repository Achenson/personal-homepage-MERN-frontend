import { UpperUiContext_i } from "../interfaces";
import { NavigateFunction } from "react-router-dom";

export function handleKeyDown_upperUiSetting(
  eventCode: string,
  upperUiContext: UpperUiContext_i,
  focusOnUpperUi_number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null,
  navigate: NavigateFunction | undefined
) {

  // before focusPayload was same as focusOnUpperUi_number, 2 items were deleted from upperUi
  // let focusPayload: ( 1 | 2 | 3 | 4 | 5 | 6 | null ) = null;
  let focusPayload = focusOnUpperUi_number;

 

  switch (eventCode) {
    case "Escape":
      if (focusOnUpperUi_number && upperUiContext) {
        switch (focusOnUpperUi_number) {
          case 5:
            upperUiContext.upperVisDispatch({
              type: "BACKGROUND_SETTINGS_TOGGLE",
            });
            break;
          case 6:
            upperUiContext.upperVisDispatch({
              type: "COLORS_SETTINGS_TOGGLE",
            });
            focusPayload = 5;
            break;
          case 7:
            upperUiContext.upperVisDispatch({
              type: "SETTINGS_TOGGLE",
            });
            focusPayload = 5;
            break;
          case 8:
            // upperUiContext.upperVisDispatch({
            //   type: "PROFILE_TOGGLE",
            // });
            (navigate as NavigateFunction)("/");
            focusPayload = 6;
            break;
          default:
            break;
        }
        console.log("focusPayload");
        console.log(focusPayload);
        
        upperUiContext.upperVisDispatch({
          type: "FOCUS_ON_UPPER_RIGHT_UI",
          payload: focusPayload,
        });
      }
      return;

    default:
      return;
  }
}

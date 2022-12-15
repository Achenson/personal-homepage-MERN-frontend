import { UpperUiContext_i } from "../interfaces";

export function handleKeyDown_inner(
  event: KeyboardEvent,
  eventCode: string,
  selectablesListVis: boolean,
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>,
  selectablesRef: React.RefObject<HTMLInputElement>,
  // upperUi only x2
  upperUiContext?: UpperUiContext_i,
  focusOnUpperUi_number?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null
) {
  switch (eventCode) {
    case "ArrowDown":
      event.preventDefault();
      if (!selectablesListVis) {
        setSelectablesListVis(true);
        (selectablesRef.current as HTMLInputElement).focus();
      }
      return;
    case "ArrowUp":
      event.preventDefault();
      return;
    case "Delete":
      if (!selectablesListVis) {
        setSelectablesInputStr("");
      }
      return;
    case "Escape":
      if (!selectablesListVis && focusOnUpperUi_number && upperUiContext) {
        switch (focusOnUpperUi_number) {
          case 1:
            upperUiContext.upperVisDispatch({
              type: "NEW_BOOKMARK_TOGGLE",
            });
            break;
          case 2:
          case 3:
          case 4:
            upperUiContext.upperVisDispatch({
              type: "NEW_TAB_TOGGLE",
            });
            break;
          default:
            break;
        }
        upperUiContext.upperVisDispatch({
          type: "FOCUS_ON_UPPER_RIGHT_UI",
          payload: focusOnUpperUi_number,
        });
      }
      return;

    default:
      return;
  }
}

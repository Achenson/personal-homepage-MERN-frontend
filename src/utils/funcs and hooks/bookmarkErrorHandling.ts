import { SingleBookmarkData, SetBookmarkErrors } from "../interfaces";
import { bookmarkErrorsAllFalse as errorsAllFalse } from "../data/errors";

import {titleRegex, tagsOrBookmarksRegexForSaving} from "../regex"

const urlRegexSafe = require("url-regex-safe");

export function bookmarkErrorHandling(
  titleInput: string,
  urlInput: string,
  tagsInputArr: string[],
  selectablesInputStr: string,
  notesTitlesArr: string[],
  rssTitlesArr: string[],
  bookmarks: SingleBookmarkData[],
  setErrors: SetBookmarkErrors,
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>,
  componentType: "new_upperUI" | "new_lowerUI" | "edit",
  currentBookmark?: SingleBookmarkData | undefined
): boolean {
  // ^  and $ -> beginning and end of the text!
  // let regexForTags = /^\w+(,\s\w+)*$/;
  // let regexForTitle = /^\w+$/;
  // https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  // const regexForLink =
  //   /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // const regexForTags = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*$/;
  // const regexForTitle = /^\w(\s?\w+)*$/;
  
  // does not contain comma
  // const regexSingleChar = /[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]/;

  // does not contain comma
  // const regexForTitle =
    // /^\w(\s?[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]*)*\w$/;

    // const regexForTitle_2 = new RegExp(`^${regexSingleChar.source}(\\s?${regexSingleChar.source}+)*$`)
    // const regexForTitle_2_unflanked = new RegExp(`${regexSingleChar.source}(\\s?${regexSingleChar.source}+)*`)

  // const regexForTitleUnflanked =
  //   /\w(\s?[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]*)*\w/;

  // regexForTitle does not allow single characters as titles
  // const regexForTitle_short = /^\w$/;

  // regex for title & bookmarks still allows multiplespaces
  // const regex_forbidden = /\s\s+/;

  // const regexForBookmarks = new RegExp("(" + regexForTitle.source + ")")
  // const regexForTags = new RegExp(
  //   `^${regexForTitleUnflanked.source}(,\\s${regexForTitleUnflanked.source})*,?$`
  // );

  // const regexForTags_2 = new RegExp(
  //   `^${regexForTitle_2_unflanked.source}(,\\s${regexForTitle_2_unflanked.source})*,?$`
  // );

  // if (!regexForTitle.test(titleInput)) {

  if (
    // (
      // !regexForTitle_2.test(titleInput)
      !titleRegex.test(titleInput)
    //  &&
    //   !regexForTitle_short.test(titleInput)) ||
    // regex_forbidden.test(titleInput)
  ) {
    setErrors({
      ...errorsAllFalse,
      titleFormatErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  // !!! difference in Link_lower_JSX for edit type

  if (!titleUniquenessCheck()) {
    setErrors({
      ...errorsAllFalse,
      titleUniquenessErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  // if (!regexForLink.test(urlInput)) {
  if (!urlInput.match(urlRegexSafe({ exact: "true", strict: "true" }))) {
    setErrors({
      ...errorsAllFalse,
      invalidLinkVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  let tagsInputArrToStr = tagsInputArr.join(", ");

  if (
    // (
      // !regexForTags_2.test(tagsInputArrToStr)
      !tagsOrBookmarksRegexForSaving.test(tagsInputArrToStr)
    //  ||
      // regex_forbidden.test(tagsInputArrToStr)) 
      &&
    selectablesInputStr !== ""
  ) {
    setErrors({
      ...errorsAllFalse,
      tagErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  for (let el of tagsInputArr) {
    if (notesTitlesArr.indexOf(el) > -1) {
      setErrors({
        ...errorsAllFalse,
        noteErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }
  }

  for (let el of tagsInputArr) {
    if (rssTitlesArr.indexOf(el) > -1) {
      setErrors({
        ...errorsAllFalse,
        rssErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }
  }

  if (!tagUniquenessCheck()) {
    setErrors({
      ...errorsAllFalse,
      tagRepeatErrorVis: true,
    });
    setSelectablesListVis(false);
    return true;
  }

  return false;

  function tagUniquenessCheck() {
    let isUnique: boolean = true;

    tagsInputArr.forEach((el, i) => {
      let tagsInputCopy = [...tagsInputArr];
      tagsInputCopy.splice(i, 1);

      if (tagsInputCopy.indexOf(el) > -1) {
        isUnique = false;
        return;
      }
    });

    return isUnique;
  }

  function titleUniquenessCheck() {
    let isUnique: boolean = true;

    bookmarks.forEach((obj, i) => {
      if (obj.title === titleInput) {
        if (componentType !== "edit") {
          isUnique = false;
        } else {
          isUnique =
            titleInput === (currentBookmark as SingleBookmarkData).title
              ? true
              : false;
        }
      }
    });

    return isUnique;
  }
}

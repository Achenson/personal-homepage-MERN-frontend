import { SingleBookmarkData, SingleTabData, SetTabErrors } from "../interfaces";
import { tabErrorsAllFalse as errorsAllFalse } from "../data/errors";

import {titleRegex, tagsOrBookmarksRegexForSaving} from "../regex"

const urlRegexSafe = require("url-regex-safe");

export function tabErrorHandling(
  bookmarks: SingleBookmarkData[],
  tabTitleInput: string,
  setErrors: SetTabErrors,
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>,
  tabType: "folder" | "note" | "rss",
  bookmarksInputArr: string[],
  rssLinkInput: string,
  tabs: SingleTabData[],
  textAreaValue: string | null,
  componentType: "edit" | "new",
  // for edit only
  initialTitle?: string
): boolean {
  // ^  and $ -> beginning and end of the text!
  // let regexForBookmarks = /^\w+(,\s\w+)*$/;
  // let regexForBookmarks = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*$/;
  // let regexForTitle = /^\w+$/;

  // https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  // const regexForLink =
  //   /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // const regexForBookmarks = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*,?$/;
  // const regexForTitle = /^\w(\s?\w+)*$/;

  // const regexForBookmarks = /^\w(\s*\S*)*\w(,\s\w(\s*\S*)*\w)*,?$/;

// does not contain comma
  // const regexSingleChar = /[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]/;

  // // does not contain comma
  // const regexForTitle =
  //   /^\w(\s*[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]*)*\w$/;

  // const regexForTitle_2 = new RegExp(`^${regexSingleChar.source}(\\s?${regexSingleChar.source}+)*$`)
  // const regexForTitle_2_unflanked = new RegExp(`${regexSingleChar.source}(\\s?${regexSingleChar.source}+)*`)



  // const regexForTitleUnflanked =
  //   /\w(\s?[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]*)*\w/;

  // regexForTitle does not allow single characters as titles
  // const regexForTitle_short = /^\w$/;

  // regex for title & bookmarks still allows multiplespaces
  // const regex_forbidden = /\s\s+/;

  // const regexForBookmarks = new RegExp("(" + regexForTitle.source + ")")
  // const regexForBookmarks = new RegExp(
  //   `^${regexForTitleUnflanked.source}(,\\s${regexForTitleUnflanked.source})*,?$`
  // );

  // const regexForBookmarks_2 = new RegExp(
  //   `^${regexForTitle_2_unflanked.source}(,\\s${regexForTitle_2_unflanked.source})*,?$`
  // );


  if (
    // (
      // !regexForTitle_2.test(tabTitleInput)
      !titleRegex.test(tabTitleInput)
      //  &&
      // !regexForTitle_short.test(tabTitleInput)) ||
    // regex_forbidden.test(tabTitleInput)
  ) {
    setErrors({
      ...errorsAllFalse,
      titleFormatErrorVis: true,
    });
    setSelectablesListVis(false);
    return true;
  }

  if (!titleUniquenessCheck()) {
    setErrors({
      ...errorsAllFalse,
      titleUniquenessErrorVis: true,
    });
    setSelectablesListVis(false);
    return true;
  }

  let bookmarksInputArrToStr = bookmarksInputArr.join(", ");

  if (tabType === "folder") {
    if (
      // !regexForBookmarks_2.test(bookmarksInputArrToStr)
      !tagsOrBookmarksRegexForSaving.test(bookmarksInputArrToStr)
      //  ||
      // regex_forbidden.test(bookmarksInputArrToStr)
    ) {
      setErrors({
        ...errorsAllFalse,
        bookmarksErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }

    if (!bookmarkExistenceCheck()) {
      setErrors({
        ...errorsAllFalse,
        bookmarkExistenceErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }

    if (!bookmarksUniquenessCheck()) {
      setErrors({
        ...errorsAllFalse,
        bookmarksRepeatErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }
  }

  if (tabType === "rss") {
    // if (!regexForLink.test(rssLinkInput)) {
    if (!rssLinkInput.match(urlRegexSafe({ exact: "true", strict: "true" }))) {
      setErrors({
        ...errorsAllFalse,
        invalidLinkErrorVis: true,
      });
      return true;
    }

    if (!rssLinkInput.match(/https/)) {
      setErrors({
        ...errorsAllFalse,
        invalidLinkErrorHttpsVis: true,
      });
      return true;
    }
  }

  if (tabType === "note") {
    if (
      (textAreaValue as string).length === 0 ||
      /^\s+$/.test(textAreaValue as string)
    ) {
      setErrors({
        ...errorsAllFalse,
        textAreaErrorVis: true,
      });
      return true;
    }
  }

  return false;

  function bookmarkExistenceCheck() {
    let bookmarksArr: string[] = [];

    bookmarks.forEach((obj) => {
      bookmarksArr.push(obj.title);
    });

    for (let el of bookmarksInputArr) {
      if (bookmarksArr.indexOf(el) === -1) {
        return false;
      }
    }

    return true;
  }

  function bookmarksUniquenessCheck() {
    let isUnique: boolean = true;

    bookmarksInputArr.forEach((el, i) => {
      let bookmarksInputCopy = [...bookmarksInputArr];
      bookmarksInputCopy.splice(i, 1);

      if (bookmarksInputCopy.indexOf(el) > -1) {
        isUnique = false;
        return;
      }
    });

    return isUnique;
  }

  function titleUniquenessCheck() {
    let isUnique: boolean = true;

    tabs.forEach((obj, i) => {
      if (obj.title === tabTitleInput) {
        if (componentType === "new") {
          isUnique = false;
        }
        if (componentType === "edit") {
          isUnique = tabTitleInput === initialTitle ? true : false;
        }
      }
    });

    return isUnique;
  }
}

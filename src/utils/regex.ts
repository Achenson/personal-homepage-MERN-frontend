// const escapeRegExp = import("lodash.escaperegexp")
const escapeRegExp = require("lodash.escaperegexp");
// selectable => either bookmarks of tags
// can be surrounded by flanking spaces and commas
export function createSelectablesRegex(singleSelectable: string) {
  let singleSelectableEscaped = escapeRegExp(singleSelectable);

  let selectablesRegex = new RegExp(
    // `(^|\\s+|,+|(\\s+,+)*|(,+\\s+)*)${singleSelectableEscaped}(\\s+|,+|(\\s+,+)*|(,+\\s+)*|$)`
    `(^|\\s+|,+)${singleSelectableEscaped}(\\s+|,+|$)`
  );
  return selectablesRegex;
}

// no commas allowed
export const singleCharRegex =
  // /[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]/;
  // /[\w~`!@#$%^&*()\-+={}[\];:'"\\|<>./?]/;
  // changed to allow (among others) letters outside standard latin, "u" had to be added to new RegExp
  // https://javascript.info/regexp-character-sets-and-ranges
  /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}~`!@#$%^&*()\-+={}[\];:'"\\|<>./?]/u;

// title for bookmark or tab
export const titleRegex = new RegExp(
  `^${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*$`, "u"
);

export const titleRegex_unflanked = new RegExp(
  `${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*`, "u"
);

export const tagsOrBookmarksRegexForSaving = new RegExp(
  `^${titleRegex_unflanked.source}(,\\s${titleRegex_unflanked.source})*$`, "u"
);



/* 

Old code -> turn out to be not needed!

export function createSelectablesRegex_flanked_start(
//   singleSelectable: string
// ) {
//   let singleSelectableEscaped = escapeRegExp(singleSelectable);
//   let selectablesRegex_flanked_start = new RegExp(
//     `${singleCharRegex.source}+${singleSelectableEscaped}`
//   );
//   return selectablesRegex_flanked_start;
// }

// // flanked by characters that can make a title
// export function createSelectablesRegex_flanked_end(singleSelectable: string) {
//   let singleSelectableEscaped = escapeRegExp(singleSelectable);
//   let selectablesRegex_flanked_end = new RegExp(
//     `${singleSelectableEscaped}${singleCharRegex.source}+`
//   );
//   return selectablesRegex_flanked_end;
// }

// // regex to prevent displaying a selectable if it is presend and a part of a longer word(eg. can canteen)
// export function createSelectablesRegex_noShorterRepeats(singleSelectable: string) {
//   let singleSelectableEscaped = escapeRegExp(singleSelectable);
//   let selectablesRegex_noShorterRepeats = new RegExp(`(^|,\\s)${singleSelectableEscaped}($|,\\s)`)
//   return selectablesRegex_noShorterRepeats;
// }

// in newTab etc.

    // if (
    //   (createSelectablesRegex_flanked_start(initialTagOrBookmark).test(
    //     selectablesInputStr
    //   ) ||
    //     createSelectablesRegex_flanked_end(initialTagOrBookmark).test(
    //       selectablesInputStr
    //     )) &&
    //   !createSelectablesRegex_noShorterRepeats(initialTagOrBookmark).test(
    //     selectablesInputStr
    //   )
    // ) {
    //   return true;
    // }



*/


/* 
old code - only /w characters were allowed in titles

let selectablesRegex = new RegExp(`\\b${el}\\b`);

 // const regexForBookmarks = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*,?$/;
// const regexForTitle = /^\w(\s?\w+)*$/;

*/

import React from "react";

import { bookmarkErrors } from "../../utils/data/errors";

import { BookmarkErrors } from "../../utils/interfaces";

interface Props {
  errors: BookmarkErrors;
}

function BookmarkErrors_render({ errors }: Props): JSX.Element {
  const errorsCSS = "text-red-500 -mb-5 -mt-1.5";

  return (
    <>
      {errors.titleFormatErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.titleFormat}</p>
      )}

      {/* error won't show up in case of Bookmark_lowerUI_edit
       (it is possible to have the same title as in the beginning of edit) */}
      {errors.titleUniquenessErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.titleUniqueness}</p>
      )}

      {errors.invalidLinkVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.invalidLink}</p>
      )}

      {errors.tagErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.tagFormat}</p>
      )}

      {errors.noteErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.noteError}</p>
      )}

      {errors.rssErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.rssError}</p>
      )}

      {errors.tagRepeatErrorVis && (
        <p className={`${errorsCSS}`}>{bookmarkErrors.tagRepeat}</p>
      )}
    </>
  );
}

export default BookmarkErrors_render;

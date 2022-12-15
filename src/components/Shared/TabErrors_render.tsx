import React from "react";

import { tabErrors } from "../../utils/data/errors";

import { TabErrors } from "../../utils/interfaces";

interface Props {
  errors: TabErrors;
  tabType: "folder" | "note" | "rss";
  componentType: "edit" | "new";
}

function TabErrors_render({
  errors,
  tabType,
  componentType,
}: Props): JSX.Element {
  let errorsCSS =
    componentType === "new" ? "text-red-500 -mb-2" : "text-red-500 mt-1 -mb-2";

  return (
    <>
      {errors.titleFormatErrorVis && (
        <p className={`${errorsCSS}`}>{tabErrors.titleFormat}</p>
      )}

      {errors.titleUniquenessErrorVis && (
        <p className={`${errorsCSS}`}>{tabErrors.titleUniqueness}</p>
      )}

      {errors.bookmarksErrorVis && tabType === "folder" && (
        <p className={`${errorsCSS}`}>{tabErrors.bookmarksFormat}</p>
      )}

      {errors.bookmarkExistenceErrorVis && tabType === "folder" && (
        <p className={`${errorsCSS}`}>{tabErrors.bookmarkExistence}</p>
      )}

      {errors.bookmarksRepeatErrorVis && tabType === "folder" && (
        <p className={`${errorsCSS}`}>{tabErrors.bookmarksRepeat}</p>
      )}

      {errors.textAreaErrorVis && tabType === "note" && (
        <p className={`${errorsCSS}`}>{tabErrors.textArea}</p>
      )}

      {errors.noDeletionErrorVis && componentType === "edit" && (
        <p className={`text-red-500 mt-1 -mb-2`}>{tabErrors.noDeletion}</p>
      )}

      {errors.invalidLinkErrorVis && tabType === "rss" && (
        <p className={`${errorsCSS}`}>{tabErrors.invalidLinkError}</p>
      )}

      {errors.invalidLinkErrorHttpsVis && tabType === "rss" && (
        <p className={`${errorsCSS}`}>{tabErrors.invalidLinkHttpsError}</p>
      )}
    </>
  );
}

export default TabErrors_render;

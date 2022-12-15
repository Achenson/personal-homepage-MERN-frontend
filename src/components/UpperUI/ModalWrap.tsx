import React, { ReactChild } from "react";
import { RemoveScroll } from "react-remove-scroll";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  children: ReactChild;
  globalSettings: GlobalSettingsState;
}

// different handling of scrollbar in case of plain color image mode and background image mode
function ModalWrap({ children, globalSettings }: Props): JSX.Element {

  return globalSettings.picBackground ? (
    <RemoveScroll removeScrollBar={false}>
      <>{children}</>
    </RemoveScroll>
  ) : (
    <>{children}</>
  );
}

export default ModalWrap;

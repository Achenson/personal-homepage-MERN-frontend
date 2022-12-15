import React from "react";

import { UpperUiContext_i } from "../utils/interfaces";

// undefined, so it can be initialised with no specific value
export const UpperUiContext = React.createContext<UpperUiContext_i | undefined>(
  undefined
);

// use in place of useContext in children (because Typescript)
export function useUpperUiContext() {
  const context = React.useContext(UpperUiContext);

  if (context === undefined) {
    throw new Error(
      "useUpperUiContext must be used within a UpperUiContext.Provider"
    );
  }

  return context;
}

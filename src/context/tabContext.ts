import React from "react";

import { TabVisAction, TabVisState } from "../utils/interfaces";

interface TabContext_i {
  tabVisState: TabVisState;
  tabVisDispatch: React.Dispatch<TabVisAction>;
}

// undefined, so it can be initialised with no specific value
export const TabContext = React.createContext<TabContext_i | undefined>(
  undefined
);

// use in place of useContext in children (because Typescript)
export function useTabContext() {
  const context = React.useContext(TabContext);

  if (context === undefined) {
    throw new Error("useTabContext must be used within a TabContext.Provider");
  }

  return context;
}

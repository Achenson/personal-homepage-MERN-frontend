import create from "zustand";

import { tabsDataDbInit } from "../../state/data/tabsData";

import { TabDatabase_i } from "../../utils/tabType";

interface UseTabsDb {
  tabsDb: TabDatabase_i[];
  updateTabsDb: (newTabsDb: TabDatabase_i[]) => void;
}

export const useTabsDb = create<UseTabsDb>((set) => ({
  tabsDb: [...tabsDataDbInit],
  updateTabsDb: (newTabsDb) =>
    set((state) => ({
      ...state,
      tabsDb: [...newTabsDb],
    })),
}));

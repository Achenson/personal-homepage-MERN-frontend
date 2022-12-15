import create from "zustand";
import { persist } from "zustand/middleware";

import {
  columnColors,
  imageColumnColors,
} from "../../utils/data/colors_column";

import { backgroundColors } from "../../utils/data/colors_background";
import { tabColors } from "../../utils/data/colors_tab";

import { GlobalSettingsState } from "../../utils/interfaces";

export interface UseGlobalSettingsAll extends GlobalSettingsState {
  setGlobalSettings: (globalSettings: GlobalSettingsState) => void;
}

export const useGlobalSettings = create<UseGlobalSettingsAll>(
  persist(
    (set) => ({
      // id & userId used in auth version
      id: "",
      userId: "",
      picBackground: false,
      defaultImage: "defaultBackground",
      oneColorForAllCols: false,
      limitColGrowth: false,
      hideNonDeletable: false,
      disableDrag: false,
      numberOfCols: 4,
      date: true,
      description: false,
      itemsPerPage: 7,
      backgroundColor: backgroundColors[0][1],
      folderColor: tabColors[7][2],
      noteColor: tabColors[1][2],
      rssColor: tabColors[9][2],
      uiColor: tabColors[7][2],
      colColor_1: columnColors[0][8],
      colColor_2: columnColors[1][5],
      colColor_3: columnColors[1][8],
      colColor_4: columnColors[3][2],
      colColorImg_1: imageColumnColors[2][6],
      colColorImg_2: imageColumnColors[2][6],
      colColorImg_3: imageColumnColors[3][5],
      colColorImg_4: imageColumnColors[0][5],
      setGlobalSettings: (globalSettings) =>
        set((state) => ({
          ...globalSettings,
        })),
    }),
    {
      name: "globalSettings-storage",
    }
  )
);

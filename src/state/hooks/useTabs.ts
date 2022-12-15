import create from "zustand";
import { persist } from "zustand/middleware";
import produce from "immer";

import { tabsData } from "../data/tabsData";

import { SingleTabData } from "../../utils/interfaces";

interface UseTabs {
  addTabs: (newTabDataArr: SingleTabData[]) => void;
  // moving tabs to lower number cols(left) if globalSettings numberOfCols changes
  tabsLessColumns: (numberOfCols: 1 | 2 | 3 | 4) => void;
  deleteTab: (tabID: string) => void;
  dragTab: (
    itemID: string,
    itemColNumber: number,
    colNumber: number,
    tabID_orNull: string | null,
    draggingIntoTab: boolean
  ) => void;
  editTab: (
    tabID: string,
    tabTitleInput: string,
    textAreaValue: string | null,
    rssLinkInput: string,
    dateCheckbox: boolean | null,
    descriptionCheckbox: boolean | null,
    rssItemsPerPage: number | null,
    wasTabOpenClicked: boolean,
    wasCheckboxClicked: boolean,
    wasItemsPerPageClicked: boolean,
    tabType: "folder" | "note" | "rss",
    tabOpenByDefault: boolean,
    setTabOpened: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  resetAllTabColors: () => void;
  setTabColor: (color: string, tabID: string) => void;
  resetTabRssSettings: (tabID: string) => void;
  tabs: SingleTabData[];
  // setting all tabs to default setting (open/close state) after clicking Reset
  closeAllTabsState: boolean;
  setCloseAllTabsState: (trueOrFalse: boolean) => void;
  // displaying tab controls when using keyboard (Tab key)
  focusedTabState: null | string;
  setFocusedTabState: (nullOrID: null | string) => void;
  // id (or empty) of a only tab that is currently being edited(eg. colors to choose are on )
  tabOpenedState: null | string;
  setTabOpenedState: (nullOrID: null | string) => void;
}

// this can be used everywhere in your application
export const useTabs = create<UseTabs>(
  persist(
    (set) => ({
      addTabs: (newTabDataArr) => {
        set(
          produce((state: UseTabs) => {
            for (let el of newTabDataArr) {
              state.tabs.push(el);
            }
          })
        );
      },
      tabsLessColumns: (numberOfCols) => {
        set(
          produce((state: UseTabs) => {
            state.tabs
              .filter((obj) => obj.column >= numberOfCols)
              .sort((a, b) => {
                if (a.title < b.title) {
                  return -1;
                }
                if (a.title > b.title) {
                  return 1;
                }
                return 0;
              })
              .forEach((obj, i) => {
                obj.column = numberOfCols;
                obj.priority = i;
              });
          })
        );
      },
      deleteTab: (tabID) =>
        set(
          produce((state: UseTabs) => {
            let tabToDelete = state.tabs.find((obj) => obj.id === tabID);
            if (tabToDelete) {
              let tabIndex = state.tabs.indexOf(tabToDelete);
              state.tabs.splice(tabIndex, 1);
            }
          })
        ),
      dragTab: (itemID, itemColNumber, colNumber, tabID, draggingIntoTab) =>
        set(
          produce((state: UseTabs) => {
            let itemToUpdate = state.tabs.find((obj) => obj.id === itemID);
            let itemToUpdateColumn_init = (itemToUpdate as SingleTabData)
              .column;
            let itemToUpdatePriority_init = (itemToUpdate as SingleTabData)
              .priority;

            if (itemToUpdate) {
              itemToUpdate.column = colNumber;
            }
            // reseting priority numbers in column that was item origin
            // no need to reset if draggingIntoTab as tabs will be switched
            if (itemColNumber !== colNumber && !draggingIntoTab) {
              state.tabs
                .filter((obj) => obj.column === itemColNumber)
                .filter((obj) => obj.id !== itemID)
                .sort((a, b) => a.priority - b.priority)
                .forEach((filteredTab, i) => {
                  let tabToUpdate = state.tabs.find(
                    (tab) => tab.id === filteredTab.id
                  );
                  if (tabToUpdate) {
                    tabToUpdate.priority = i;
                  }
                });
            }

            // when column is empty
            if (!tabID) {
              if (itemToUpdate) {
                itemToUpdate.priority = 0;
              }
              return;
            }

            // index of a tab before the gap the tab is dragged into
            let draggedIntoIndex: number = 0;

            state.tabs.forEach((obj, i) => {
              if (obj.id === tabID) {
                draggedIntoIndex = i;
              }
            });

            let draggedIntoPriority = state.tabs[draggedIntoIndex].priority;

            // dragging into tab
            if (draggingIntoTab && itemToUpdate) {
              let tabToUpdate = state.tabs[draggedIntoIndex];
              itemToUpdate.column = tabToUpdate.column;
              itemToUpdate.priority = tabToUpdate.priority;
              tabToUpdate.column = itemToUpdateColumn_init;
              tabToUpdate.priority = itemToUpdatePriority_init;
              return;
            }

            // dragging into gap
            // change priorities only if:
            if (
              itemToUpdate &&
              // draggedItem is not the same as dragged into tab
              itemID !== tabID &&
              // if draggedIntoTab is not the previous tab OR draggedItem do not belongs to the column
              (draggedIntoPriority + 1 !== itemToUpdate?.priority ||
                colNumber !== itemColNumber)
            ) {
              // changing itemToUpdate priority
              if (colNumber !== itemColNumber) {
                itemToUpdate.priority = draggedIntoPriority + 1;
              }
              if (colNumber === itemColNumber) {
                // if dragging to a Tab further down
                if (draggedIntoPriority > itemToUpdate.priority) {
                  itemToUpdate.priority = draggedIntoPriority;
                  //  if dragging to a Tab further up
                } else {
                  itemToUpdate.priority = draggedIntoPriority + 1;
                }
              }

              // changing priority of other tabs in the column that the item is being dragged to
              state.tabs
                .filter((obj) => obj.column === colNumber)
                .filter((obj) => obj.id !== itemID)
                .sort((a, b) => a.priority - b.priority)
                .forEach((filteredTab, i) => {
                  let tabToUpdate = state.tabs.find(
                    (tab) => tab.id === filteredTab.id
                  );

                  if (tabToUpdate) {
                    // if the tab being updated is the one being dragged INTO or further up
                    if (tabToUpdate.priority <= draggedIntoPriority) {
                      // i => tab being dragged has already been filtered
                      tabToUpdate.priority = i;
                      // if the tab being updated is further down that the tab being dragged INTO
                    } else {
                      if (colNumber !== itemColNumber) {
                        tabToUpdate.priority += 1;
                      } else {
                        // DO NOT UPDATE TABS further down than the tab being dragged if tab is being dragged up
                        if (
                          draggedIntoPriority < itemToUpdatePriority_init &&
                          tabToUpdate.priority > itemToUpdatePriority_init
                        ) {
                          return;
                        }
                        // DO NOT UPDATE TABS further down than the tab being dragged INTO if tab is being dragged down
                        if (
                          draggedIntoPriority > itemToUpdatePriority_init &&
                          tabToUpdate.priority > draggedIntoPriority
                        ) {
                          return;
                        }
                        tabToUpdate.priority += 1;
                      }
                    }
                  }
                });
            }
          })
        ),

      editTab: (
        tabID,
        tabTitleInput,
        textAreaValue,
        rssLinkInput,
        dateCheckbox,
        descriptionCheckbox,
        rssItemsPerPage,
        wasTabOpenClicked,
        wasCheckboxClicked,
        wasItemsPerPageClicked,
        tabType,
        tabOpenedByDefault,
        setTabOpened
      ) => {
        set(
          produce((state: UseTabs) => {
            let tabToUpdate = state.tabs.find((obj) => obj.id === tabID);
            if (tabToUpdate) {
              tabToUpdate.title = tabTitleInput;
              if (wasTabOpenClicked) {
                tabToUpdate.openedByDefault = tabOpenedByDefault;
                setTabOpened(tabOpenedByDefault);
              }

              if (tabType === "note") {
                tabToUpdate.noteInput = textAreaValue;
              }
              if (tabType === "rss") {
                tabToUpdate.rssLink = rssLinkInput;

                if (wasCheckboxClicked) {
                  tabToUpdate.date = dateCheckbox;
                }

                if (wasCheckboxClicked) {
                  tabToUpdate.description = descriptionCheckbox;
                }

                if (wasItemsPerPageClicked) {
                  tabToUpdate.itemsPerPage = rssItemsPerPage;
                }
              }
            }
          })
        );
      },
      resetAllTabColors: () =>
        set(
          produce((state: UseTabs) => {
            state.tabs.forEach((obj, i) => {
              obj.color = null;
            });
          })
        ),
      setTabColor: (color, tabID) =>
        set(
          produce((state: UseTabs) => {
            let tabToChange = state.tabs.find((obj) => obj.id === tabID);

            if (tabToChange) {
              tabToChange.color = `${color}`;
            }
          })
        ),
      resetTabRssSettings: (tabID: string) =>
        set(
          produce((state: UseTabs) => {
            let currentTab = state.tabs.find((obj) => obj.id === tabID);
            if (currentTab) {
              currentTab.date = null;
              currentTab.description = null;
              currentTab.itemsPerPage = null;
            }
          })
        ),
      tabs: [...tabsData],
      // in both non-auth (Tab) & auth (Grid) ->
      closeAllTabsState: false,
      setCloseAllTabsState: (trueOrFalse) => {
        set((state: UseTabs) => ({
          ...state,
          closeAllTabsState: trueOrFalse,
        }));
      },
      // both non-auth and auth
      focusedTabState: null,
      setFocusedTabState: (nullOrID) => {
        set((state: UseTabs) => ({
          ...state,
          focusedTabState: nullOrID,
        }));
      },
      // both non-auth and auth
      tabOpenedState: null,
      setTabOpenedState: (nullOrID) => {
        set((state: UseTabs) => ({
          ...state,
          tabOpenedState: nullOrID,
        }));
      },
    }),
    {
      name: "tabs-storage",
    }
  )
);

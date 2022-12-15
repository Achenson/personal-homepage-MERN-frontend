import { TabDatabase_i } from "../../../../schema/types/tabType";

export function dragTabDb(
  itemID: string,
  itemColNumber: number,
  colNumber: number,
  tabID: string | null,
  draggingIntoTab: boolean,
  tabs: TabDatabase_i[],
  editTab: (changedTab: TabDatabase_i) => {}
) {
  let itemToUpdate = tabs.find((obj) => obj.id === itemID);

  let itemToUpdateColumn_init = (itemToUpdate as TabDatabase_i).column;
  let itemToUpdatePriority_init = (itemToUpdate as TabDatabase_i).priority;

  let newItemToUpdate;

  if (itemToUpdate) {
    newItemToUpdate = { ...itemToUpdate };
  }

  //   if (itemToUpdate) {
  if (newItemToUpdate) {
    // itemToUpdate.column = colNumber;
    newItemToUpdate.column = colNumber;
  }

  // reseting priority numbers in column that was item origin
  // no need to reset if draggingIntoTab as tabs will be switched
  if (itemColNumber !== colNumber && !draggingIntoTab) {
    tabs
      .filter((obj) => obj.column === itemColNumber)
      .filter((obj) => obj.id !== itemID)
      .sort((a, b) => a.priority - b.priority)
      .forEach((filteredTab, i) => {
        let tabToUpdate = tabs.find((tab) => tab.id === filteredTab.id);
        if (tabToUpdate) {
          //   tabToUpdate.priority = i;
          editTab({ ...tabToUpdate, priority: i });
        }
      });
  }

  // when column is empty
  if (!tabID) {

    // if (itemToUpdate) {
    if (newItemToUpdate) {
      //   itemToUpdate.priority = 0;
      newItemToUpdate.priority = 0;
      editTab({ ...newItemToUpdate });
    }

    return;
  }

  // index of a tab before the gap the tab is dragged into
  let draggedIntoIndex: number = 0;

  tabs.forEach((obj, i) => {
    if (obj.id === tabID) {
      draggedIntoIndex = i;
    }
  });

  let draggedIntoPriority = tabs[draggedIntoIndex].priority;

  // dragging into tab
  //   if (draggingIntoTab && itemToUpdate) {
  if (draggingIntoTab && newItemToUpdate) {

    let tabToUpdate = tabs[draggedIntoIndex];

    /*     itemToUpdate.column = tabToUpdate.column;
    itemToUpdate.priority = tabToUpdate.priority; */
    newItemToUpdate.column = tabToUpdate.column;
    newItemToUpdate.priority = tabToUpdate.priority;

    editTab({
      ...newItemToUpdate,
    });

    let newTabToUpdate = { ...tabToUpdate };

    /* tabToUpdate.column = itemToUpdateColumn_init;
    tabToUpdate.priority = itemToUpdatePriority_init; */

    newTabToUpdate.column = itemToUpdateColumn_init;
    newTabToUpdate.priority = itemToUpdatePriority_init;

    editTab({
      ...newTabToUpdate,
    });
    return;
  }

  // dragging into gap
  // change priorities only if:
  if (
    // itemToUpdate &&
    newItemToUpdate &&
    // draggedItem is not the same as dragged into tab
    itemID !== tabID &&
    // if draggedIntoTab is not the previous tab OR draggedItem do not belongs to the column
    // (draggedIntoPriority + 1 !== itemToUpdate?.priority ||
    (draggedIntoPriority + 1 !== newItemToUpdate.priority ||
      colNumber !== itemColNumber)
  ) {
    // changing itemToUpdate priority
    if (colNumber !== itemColNumber) {
      //   itemToUpdate.priority = draggedIntoPriority + 1;
      newItemToUpdate.priority = draggedIntoPriority + 1;
    }
    if (colNumber === itemColNumber) {
      // if dragging to a Tab further down
      //   if (draggedIntoPriority > itemToUpdate.priority) {
      if (draggedIntoPriority > (newItemToUpdate as TabDatabase_i).priority) {
        // itemToUpdate.priority = draggedIntoPriority;
        newItemToUpdate.priority = draggedIntoPriority;
        //  if dragging to a Tab further up
      } else {
        // itemToUpdate.priority = draggedIntoPriority + 1;
        newItemToUpdate.priority = draggedIntoPriority + 1;
      }
    }

    editTab({ ...newItemToUpdate });

    // changing priority of other tabs in the column that the item is being dragged to
    tabs
      .filter((obj) => obj.column === colNumber)
      .filter((obj) => obj.id !== itemID)
      .sort((a, b) => a.priority - b.priority)
      .forEach((filteredTab, i) => {
        let tabToUpdate = tabs.find((tab) => tab.id === filteredTab.id);

        let newTabToUpdate;

        if (tabToUpdate) {
          newTabToUpdate = { ...tabToUpdate };
        }

        // if (tabToUpdate) {
        if (newTabToUpdate) {
          // if the tab being updated is the one being dragged INTO or further up
          if (newTabToUpdate.priority <= draggedIntoPriority) {
            // i => tab being dragged has already been filtered
            newTabToUpdate.priority = i;
            // if the tab being updated is further down that the tab being dragged INTO
          } else {
            if (colNumber !== itemColNumber) {
              newTabToUpdate.priority += 1;
            } else {
              // DO NOT UPDATE TABS further down than the tab being dragged if tab is being dragged up
              if (
                draggedIntoPriority < itemToUpdatePriority_init &&
                newTabToUpdate.priority > itemToUpdatePriority_init
              ) {
                return;
              }
              // DO NOT UPDATE TABS further down than the tab being dragged INTO if tab is being dragged down
              if (
                draggedIntoPriority > itemToUpdatePriority_init &&
                newTabToUpdate.priority > draggedIntoPriority
              ) {
                return;
              }
              newTabToUpdate.priority += 1;
            }
          }
        }
        if (newTabToUpdate) {
          editTab({ ...newTabToUpdate });
        }
      });
  }
}

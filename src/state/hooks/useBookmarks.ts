import create from "zustand";
import { persist } from "zustand/middleware";
import produce from "immer";

import { bookmarksData } from "../data/bookmarksData";

import { SingleBookmarkData } from "../../utils/interfaces";

interface UseBookmarks {
  addBookmark: (singleBookmarkData: SingleBookmarkData) => void;
  getTabsToDelete: (
    bookmarkIdToDelete: string,
    bookmarkTagsToDelete: string[]
  ) => string[];
  editBookmark: (
    editId: string,
    title: string,
    URL: string,
    tags: string[],
    defaultFaviconFallback: boolean
  ) => void;
  deleteBookmark: (
    bookmarkID: string,
    singleBookmarkData: SingleBookmarkData
  ) => void;
  addTag: (newFolderTabId: string, bookmarksInputArr: string[]) => void;
  // changing or adding a tag in all bookmarks
  editTag: (
    tabID: string,
    arrOfBookmarksNames: string[],
    bookmarksInputArr: string[]
  ) => void;
  // delete tag in all bookmarks
  deleteTag: (tabTitle: string) => void;
  bookmarks: SingleBookmarkData[];
}

// non-auth only
export const useBookmarks = create<UseBookmarks>(
  persist(
    (set, get) => ({
      getTabsToDelete(bookmarkIdToDelete, bookmarkTagsToDelete) {
        // should contain all tags, but without the tags present in bookmark to del
        let arrOfTags: string[] = [];
        let bmarksWithoutBkmarkToDel: SingleBookmarkData[] =
          get().bookmarks.filter((el) => el.id !== bookmarkIdToDelete);

        // pushing unique tags to arrOfAllTags
        for (let bmark of bmarksWithoutBkmarkToDel) {
          for (let tag of bmark.tags) {
            if (arrOfTags.indexOf(tag) === -1) {
              arrOfTags.push(tag);
            }
          }
        }

        let tagsToDelete: string[] = [];

        // if one of the tag(tab) of bookmark to del is not present is all tags -> this tags (tabs) to delete
        for (let tag of bookmarkTagsToDelete) {
          if (arrOfTags.indexOf(tag) === -1) {
            tagsToDelete.push(tag);
          }
        }

        return tagsToDelete;
      },

      addBookmark: (singleBookmarkData) => {
        set(
          produce((state: UseBookmarks) => {
            state.bookmarks.push(singleBookmarkData);
          })
        );
      },
      editBookmark: (editId, title, URL, tags, defaultFaviconFallback) => {
        set(
          produce((state: UseBookmarks) => {
            let bookmarkToUpdate = state.bookmarks.find(
              (obj) => obj.id === editId
            );

            if (bookmarkToUpdate) {
              bookmarkToUpdate.title = title;
              bookmarkToUpdate.URL = URL;
              bookmarkToUpdate.tags = [...tags];
              bookmarkToUpdate.defaultFaviconFallback = defaultFaviconFallback;
            }
          })
        );
      },

      deleteBookmark: (bookmarkID, singleBookmarkData) => {
        let tagsIdsToDelete: string[] = [];
        singleBookmarkData.tags.forEach((el) => {
          let filteredBookmarks = get().bookmarks.filter(
            (obj) => obj.id !== singleBookmarkData.id
          );

          let isElPresent: boolean = false;

          filteredBookmarks.forEach((obj) => {
            if (obj.tags.indexOf(el) > -1) {
              isElPresent = true;
              return;
            }
          });

          if (!isElPresent && el !== "ALL_TAGS") {
            tagsIdsToDelete.push(el);
          }
        });

        set((state) => ({
          ...state,
          bookmarks: state.bookmarks.filter(({ id }) => id !== bookmarkID),
        }));
      },

      addTag: (newFolderTabId, bookmarksInputArr) => {
        // updating links data (tags array)
        set(
          produce((state: UseBookmarks) => {
            state.bookmarks.forEach((obj) => {
              if (
                bookmarksInputArr.indexOf(obj.title) > -1 &&
                obj.tags.indexOf(newFolderTabId) === -1
              ) {
                obj.tags.push(newFolderTabId);
              }
            });
          })
        );
      },
      editTag: (tabID, arrOfBookmarksNames, bookmarksInputArr) => {
        set(
          produce((state: UseBookmarks) => {
            state.bookmarks.forEach((obj) => {
              // make array of missing bookmarks
              let missingBookmarks: string[] = [];

              arrOfBookmarksNames.forEach((el, i) => {
                if (bookmarksInputArr.indexOf(el) === -1) {
                  missingBookmarks.push(el);
                }
              });

              // if this bookmarks' title is inside missing bookmarks
              // cut out tabID (current folder) from tags
              if (missingBookmarks.indexOf(obj.title) > -1) {
                obj.tags.splice(obj.tags.indexOf(tabID), 1);
              }

              //  if link title is present in folder's new input for tags & if folder title wasn't already in tags
              // add new tag
              if (
                bookmarksInputArr.indexOf(obj.title) > -1 &&
                obj.tags.indexOf(tabID) === -1
              ) {
                obj.tags.push(tabID);
              }
            });
          })
        );
      },

      deleteTag: (tabTitle) => {
        set(
          produce((state: UseBookmarks) => {
            state.bookmarks.forEach((obj, i) => {
              if (obj.tags.indexOf(tabTitle as string) > -1) {
                state.bookmarks[i].tags.splice(
                  obj.tags.indexOf(tabTitle as string),
                  1
                );
              }
            });
          })
        );
      },

      bookmarks: [...bookmarksData],
    }),
    {
      name: "bookmarks-storage",
    }
  )
);

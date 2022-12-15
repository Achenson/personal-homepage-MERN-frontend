import create from "zustand";

import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";

export type ReexecuteBookmarks = (opts?: Partial<any> | undefined) => void;

interface UseBookmarksDb {
  bookmarksDb: BookmarkDatabase_i[];
  updateBookmarksDb: (newBookmarksDb: BookmarkDatabase_i[]) => void;
  reexecuteBookmarks: ReexecuteBookmarks | null;
  updateReexecuteBookmarks: (
    reexecuteBookmarksFunc: ReexecuteBookmarks
  ) => void;
}

export const useBookmarksDb = create<UseBookmarksDb>((set) => ({
  bookmarksDb: [],
  updateBookmarksDb: (newBookmarksDb) =>
    set((state) => ({
      ...state,
      bookmarksDb: [...newBookmarksDb],
    })),
  reexecuteBookmarks: null,
  updateReexecuteBookmarks: (reexecuteBookmarksFunc) =>
    set((state) => ({
      ...state,
      reexecuteBookmarks: reexecuteBookmarksFunc,
    })),
}));

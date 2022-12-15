import { v4 as uuidv4 } from "uuid";

import { SingleTabData, SingleBookmarkData } from "../interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../../schema/types/tabType";

export function createBasicTab(
  title: string,
  column: number,
  priority: number,
  openedByDefault: boolean = false,
  deletable: boolean = true
) {
  return {
    id: uuidv4(),
    title,
    color: null,
    column,
    priority,
    openedByDefault,
    deletable,
  };
}

export function createFolderTab_partial(
  type: "folder" | "note" | "rss" = "folder"
) {
  return {
    type,
  };
}

export function createFolderTab(
  title: string,
  column: number,
  priority: number
): SingleTabData {
  return {
    ...createBasicTab(title, column, priority),
    ...createFolderTab_partial(),
  };
}

export function createFolderTabDb(
  userId: string,
  title: string,
  column: number,
  priority: number
): TabDatabase_i {
  return {
    userId: userId,
    ...createFolderTab(title, column, priority)
    // ...createBasicTab(title, column, priority),
    // ...createFolderTab_partial(),
  };
}

export function createNote_partial(
  noteInput: string | null,
  type: "folder" | "note" | "rss" = "note"
) {
  return {
    noteInput,
    type,
  };
}

export function createNote(
  title: string,
  column: number,
  priority: number,
  noteInput: string | null
): SingleTabData {
  return {
    ...createBasicTab(title, column, priority),
    ...createNote_partial(noteInput),
  };
}

export function createNoteDb(
  userId: string,
  title: string,
  column: number,
  priority: number,
  noteInput: string | null
): TabDatabase_i {
  return {
    userId: userId,
    ...createNote(title, column, priority, noteInput)
    // ...createBasicTab(title, column, priority),
    // ...createNote_partial(noteInput),
  };
}

export function createRSS_partial(
  rssLink: string | null,
  type: "folder" | "note" | "rss" = "rss",
  date: null | boolean = null,
  description: null | boolean = null,
  itemsPerPage: null | number = null
) {
  return {
    rssLink,
    type,
    date,
    description,
    itemsPerPage,
    // items: [],
  };
}

export function createRSS(
  title: string,
  column: number,
  priority: number,
  rssLink: string
): SingleTabData {
  return {
    ...createBasicTab(title, column, priority),
    ...createRSS_partial(rssLink),
  };
}

export function createRSSDb(
  userId: string,
  title: string,
  column: number,
  priority: number,
  rssLink: string
): TabDatabase_i {
  return {
    userId: userId,
    ...createRSS(title, column, priority, rssLink)
    // ...createBasicTab(title, column, priority),
    // ...createRSS_partial(rssLink),
  };
}

export function createBookmarkNotAuth(
  title: string,
  URL: string,
  tags: string[],
  defaultFaviconFallback = false
): SingleBookmarkData {
  return {
    id: uuidv4(),
    title,
    URL,
    tags,
    defaultFaviconFallback,
  };
}

export function createBookmarkDb(
  userId: string,
  title: string,
  URL: string,
  tags: string[],
  defaultFaviconFallback = false
): BookmarkDatabase_i {
  return {
    ...createBookmarkNotAuth(title, URL, tags),
    userId: userId,
  };
}

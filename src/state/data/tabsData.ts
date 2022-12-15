import { SingleTabData } from "../../utils/interfaces";

interface TabDatabaseInit_i extends SingleTabData {
  userId: string;
}

export const tabsData: SingleTabData[] = [
  {
    id: "ALL_TAGS",
    title: "all bookmarks",
    color: "red-400",
    column: 1,
    priority: 1,
    openedByDefault: true,
    deletable: false,
    type: "folder",
  },
  {
    id: "2",
    title: "main",
    color: null,
    column: 1,
    priority: 0,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "3",
    title: "social",
    color: null,
    column: 2,
    priority: 0,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "4",
    title: "fun",
    color: null,
    column: 2,
    priority: 1,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "5",
    title: "info",
    color: null,
    column: 2,
    priority: 2,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "6",
    title: "about",
    color: null,
    column: 4,
    priority: 0,
    openedByDefault: true,
    deletable: true,
    type: "note",
    noteInput: `Welcome to SmoothTabs,

Manage bookmarks, notes and RSS channels in a form of draggable & foldable tabs.

Register to get persistent data storage and an option to upload an image as a background. Unregistered user's data is preserved until the browser data is cleared.

WARNING: uploaded images are visible to the admin. Images need to be reuploaded after every 6 months.

Refer to tips & tricks note for advanced usage.
`,
  },
  {
    id: "65",
    title: "tips & tricks",
    color: null,
    column: 4,
    priority: 1,
    openedByDefault: false,
    deletable: true,
    type: "note",
    noteInput: `The safest way to enter proper URL address for a bookmark is to copy it directly from your browser address bar.

RSS channels without a secure link (not starting with https) are not allowed.

The tabs' content visibility can be reset (curly arrow in the upper left section) to default state, which can be set for individual tabs.

Tab colors can be set either individually or globally for bookmark folders, notes and RSS channels. In "Default tab colors" settings menu you can reset all individual tab colors to global configuration.

RSS settings can be controlled globally or separately for individual RSS channels. Each RSS tab can be reset back to global configuration.

Tabs can be dragged around by long pressing anywhere within the tab label. You can disable drag & drop in global settings if you encounter accidental tab dragging on a touchscreen.

Double click on a note's content for the fastest way to edit it.

Click a bookmark favicon to change it for default icon.

Bookmark folders are being deleted automatically when empty, except for "all bookmarks" folder.

Selected UI elements automatically change color for a one similar to current default color of bookmark folders.

Except for tabs' position rearranging, all SmoothTabs features can be controlled using keyboard.`,
  },
  {
    id: "7",
    title: "guardian",
    color: null,
    column: 3,
    priority: 0,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://feeds.theguardian.com/theguardian/uk-news/rss",
  },
  {
    id: "8",
    title: "science alert",
    color: null,
    column: 3,
    priority: 1,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://feeds.feedburner.com/sciencealert-latestnews",
  },
  {
    id: "9",
    title: "tech beacon",
    color: null,
    column: 3,
    priority: 2,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://techbeacon.com/rss.xml",
  },
];

// crucial for zustand db to work (problems with )
export const tabsDataDbInit: TabDatabaseInit_i[] = [
  {
    id: "ALL_TAGS",
    userId: "",
    title: "all bookmarks",
    color: "red-400",
    column: 1,
    priority: 1,
    openedByDefault: true,
    deletable: false,
    type: "folder",
  },
];

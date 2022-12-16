import { BookmarkDatabase_i } from "../utils/bookmarkType";
import { TabDatabase_i } from "../utils/tabType";

export interface BookmarkErrors {
  tagErrorVis: boolean;
  tagRepeatErrorVis: boolean;
  titleFormatErrorVis: boolean;
  titleUniquenessErrorVis: boolean;
  noteErrorVis: boolean;
  rssErrorVis: boolean;
  invalidLinkVis: boolean;
}

export type SetBookmarkErrors = React.Dispatch<
  React.SetStateAction<BookmarkErrors>
>;

export interface TabErrors {
  bookmarksErrorVis: boolean;
  bookmarksRepeatErrorVis: boolean;
  titleFormatErrorVis: boolean;
  titleUniquenessErrorVis: boolean;
  bookmarkExistenceErrorVis: boolean;
  textAreaErrorVis: boolean;
  noDeletionErrorVis: boolean;
  invalidLinkErrorVis: boolean;
  invalidLinkErrorHttpsVis: boolean;
}

export type SetTabErrors = React.Dispatch<React.SetStateAction<TabErrors>>;

export interface SingleTabDataBasic {
  title: string;
  color: string | null;
  column: number;
  priority: number;
  openedByDefault: boolean;
  deletable: boolean;
  type: "folder" | "note" | "rss";
  noteInput?: string | null;
  rssLink?: string | null;
  date?: boolean | null;
  description?: boolean | null;
  itemsPerPage?: number | null;
  // items?: [object] | never[] | [];
}

export interface SingleTabData extends SingleTabDataBasic {
  id: string;
}

export interface SingleBookmarkDataBasic {
  title: string;
  URL: string;
  defaultFaviconFallback: boolean;
}


export interface SingleBookmarkData extends SingleBookmarkDataBasic{
  id: string;
  tags: string[];
}

export interface GlobalSettingsState {
  id: string;
  userId: string;
  picBackground: boolean;
  defaultImage: string;
  oneColorForAllCols: boolean;
  limitColGrowth: boolean;
  hideNonDeletable: boolean;
  disableDrag: boolean;
  numberOfCols: 1 | 2 | 3 | 4;
  // rss settings
  date: boolean;
  description: boolean;
  itemsPerPage: number;
  // new
  backgroundColor: string;
  folderColor: string;
  noteColor: string;
  rssColor: string;
  uiColor: string;
  colColor_1: string;
  colColor_2: string;
  colColor_3: string;
  colColor_4: string;
  colColorImg_1: string;
  colColorImg_2: string;
  colColorImg_3: string;
  colColorImg_4: string;
}

export interface UpperVisState {
  newBookmarkVis: boolean;
  newTabVis: boolean;
  backgroundSettingsVis: boolean;
  settingsVis: boolean;
  colorsSettingsVis: boolean;
  colorsBackgroundVis: boolean;
  colorsColumnVis: boolean;
  columnSelected: null | number;
  addTabVis_xs: boolean;
  xsSizing_initial: boolean;
  tabEditablesOpenable: boolean;
  // messagePopup: null | string;
  currentXSsettings: "background" | "colors" | "global";
  // for focusing specific SVG when closing any of the upperRight UI settings with the keyboard
  // 1-8 corresponds to UpperRightUi (normal sized version) from left to right
  focusOnUpperRightUi: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export interface UpperUiContext_i {
  upperVisState: UpperVisState;
  upperVisDispatch: React.Dispatch<UpperVisAction>;
}

// export interface DbContext_i {
//   bookmarks: BookmarkDatabase_i[];
//   tabs: TabDatabase_i[];
//   // stale_bookmarks: boolean;
//   // reexecuteBookmarks: (opts?: Partial<OperationContext> | undefined) => void;
//   reexecuteBookmarks: (opts?: Partial<any> | undefined) => void;
//   // reexecuteTabs: (opts?: Partial<any> | undefined) => void;
// }

// export interface BackgroundImgContext_i {
//   currentBackgroundImgKey: string;
//   updateCurrentBackgroundImgKey: React.Dispatch<React.SetStateAction<string>>;
// }

// interface AuthContextObj_i {
//   isAuthenticated: boolean;
//   authenticatedUserId: null | string;
//   accessToken: null | string;
//   loginNotification: null | string;

//   // loginErrorMessage: null | string;
// }

// export interface AuthContext_i extends AuthContextObj_i {
//   updateAuthContext: React.Dispatch<React.SetStateAction<AuthContextObj_i>>;
// }

export interface AuthContextZustand_i {
  isAuthenticated: boolean;
  authenticatedUserId: null | string;
  accessToken: null | string;
  loginNotification: null | string;
  messagePopup: null | string;
  logout: (loginNotification: string|null) => void;
  loginAttempt: (
    isAuthenticated: boolean,
    userId: string,
    token: string
  ) => void;
  setLoginNotification: (loginNotification: string|null) => void;
  setMessagePopup: (message: string|null) => void;
}

// for Tab
export interface TabVisState {
  editTabVis: boolean;
  colorsVis: boolean;
  // tabContentVis: boolean;
  newBookmarkVis: boolean;
  editBookmarkVis: null | string;
  touchScreenModeOn: boolean;
}

interface UpperVisAction_noPayload {
  type:
    | "NEW_BOOKMARK_TOGGLE"
    | "NEW_TAB_TOGGLE"
    | "BACKGROUND_SETTINGS_TOGGLE"
    | "SETTINGS_TOGGLE"
    | "COLORS_SETTINGS_TOGGLE"
    | "COLORS_BACKGROUND_TOGGLE"
    | "COLORS_COLUMN_TOGGLE"
    | "CLOSE_ALL"
    | "ADD_TAB_XS_TOGGLE"
    | "XS_SIZING_TRUE"
    | "XS_SIZING_FALSE"
    | "TAB_EDITABLES_OPENABLE_DEFAULT"
    // | "MESSAGE_OPEN_LOGIN"
    // | "MESSAGE_OPEN_LOGOUT"
    // | "MESSAGE_CLOSE"
    | "CURRENT_XS_SETTINGS_BACKGROUND"
    | "CURRENT_XS_SETTINGS_COLORS"
    | "CURRENT_XS_SETTINGS_GLOBAL";
}

interface UpperVisAction_COLORS_COLUMN_OPEN {
  type: "COLORS_COLUMN_OPEN";
  payload: number;
}

interface UpperVisAction_FOCUS_ON_UPPER_RIGHT_UI {
  type: "FOCUS_ON_UPPER_RIGHT_UI";
  payload: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export type UpperVisAction =
  | UpperVisAction_noPayload
  | UpperVisAction_COLORS_COLUMN_OPEN
  | UpperVisAction_FOCUS_ON_UPPER_RIGHT_UI;

interface TabVisAction_noPayload {
  type:
    | "COLORS_CLOSE"
    | "EDIT_CLOSE"
    | "COLORS_SETTINGS_TOGGLE"
    | "EDIT_TOGGLE"
    | "TAB_CONTENT_TOGGLE"
    | "TAB_CONTENT_DEFAULT"
    | "TAB_CONTENT_OPEN_AFTER_LOCKING"
    | "TAB_EDITABLES_CLOSE"
    | "NEW_BOOKMARK_TOOGLE"
    | "EDIT_BOOKMARK_CLOSE"
    | "TOUCH_SCREEN_MODE_ON"
    | "EDIT_TOGGLE_NOTE_OPEN";
}

interface TabVisAction_EDIT_BOOKMARK_OPEN {
  type: "EDIT_BOOKMARK_OPEN";
  payload: string;
}

export type TabVisAction =
  | TabVisAction_noPayload
  | TabVisAction_EDIT_BOOKMARK_OPEN

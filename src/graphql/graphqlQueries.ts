export const TabsQuery = `query ($userId: ID) {
    tabs (userId: $userId) {
      id
      userId
      title
      color
      column
      priority
      openedByDefault
      deletable
      type
      noteInput
      rssLink
      date
      description
      itemsPerPage
    }
  }`;

export const BookmarksQuery = `query ($userId: ID) {
    bookmarks (userId: $userId) {
      id
      userId
      title
      URL
      tags
      defaultFaviconFallback
    }
  }`;

export const SettingsQuery = `query ($userId: ID) {
    settings (userId: $userId) {
    id
    userId
    picBackground
    defaultImage
    oneColorForAllCols
    limitColGrowth
    hideNonDeletable
    disableDrag
    numberOfCols
    date
    description
    itemsPerPage
    backgroundColor
    folderColor
    noteColor
    rssColor
    uiColor
    colColor_1
    colColor_2
    colColor_3
    colColor_4
    colColorImg_1
    colColorImg_2
    colColorImg_3
    colColorImg_4
    }
  }`;

export const BackgroundImgQuery = `query ($userId: ID) {
    backgroundImg (userId: $userId) {
      backgroundImgUrl
    }
  }`;

export const UserQuery = `query ($userId: ID) {
      user (userId: $userId) {
        name
        email
       
      }
    }`;

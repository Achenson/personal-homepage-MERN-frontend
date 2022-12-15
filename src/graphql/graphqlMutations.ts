export const ChangeSettingsMutation = `
  mutation ($userId: ID,
    $picBackground: Boolean,
    $defaultImage: String,
    $oneColorForAllCols: Boolean,
    $limitColGrowth: Boolean,
    $hideNonDeletable: Boolean,
    $disableDrag: Boolean,
    $numberOfCols: Int,
    $date: Boolean,
    $description: Boolean,
    $itemsPerPage: Int,
    $backgroundColor: String,
    $folderColor: String,
    $noteColor: String,
    $rssColor: String,
    $uiColor: String,
    $colColor_1: String,
    $colColor_2: String,
    $colColor_3: String,
    $colColor_4: String,
    $colColorImg_1: String,
    $colColorImg_2: String,
    $colColorImg_3: String,
    $colColorImg_4: String
    ) {
    changeSettings (userId: $userId, 
        picBackground: $picBackground,
        defaultImage: $defaultImage,
        oneColorForAllCols: $oneColorForAllCols,
        limitColGrowth: $limitColGrowth,
        hideNonDeletable: $hideNonDeletable,
        disableDrag: $disableDrag,
        numberOfCols: $numberOfCols,
        date: $date,
        description: $description,
        itemsPerPage: $itemsPerPage,
        backgroundColor: $backgroundColor,
        folderColor: $folderColor,
        noteColor: $noteColor,
        rssColor: $rssColor,
        uiColor:  $uiColor,
        colColor_1: $colColor_1,
        colColor_2: $colColor_2,
        colColor_3: $colColor_3,
        colColor_4: $colColor_4,
        colColorImg_1: $colColorImg_1,
        colColorImg_2: $colColorImg_2,
        colColorImg_3: $colColorImg_3,
        colColorImg_4: $colColorImg_4
        ) {
            picBackground
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
  }
`;

export const AddBookmarkMutation = `
  mutation ($userId: ID,
    $title: String,
    $URL: String,
    $tags: [ID]
    ) {
    addBookmark (userId: $userId, 
      title: $title,
      URL: $URL,
      tags: $tags,
        ) {
          id
          userId
          title
          URL
          tags
    }
  }
`;

export const ChangeBookmarkMutation = `
  mutation (
    $id: ID,
    $userId: ID,
    $title: String,
    $URL: String,
    $tags: [ID]
    $defaultFaviconFallback: Boolean
    ) {
    changeBookmark (
      id: $id,
      userId: $userId, 
      title: $title,
      URL: $URL,
      tags: $tags,
      defaultFaviconFallback: $defaultFaviconFallback
        ) {
          id
          userId
          title
          URL
          tags
          defaultFaviconFallback
    }
  }
`;

export const DeleteBookmarkMutation = `
  mutation ($id: ID,
    ) {
    deleteBookmark (id: $id, 
        ) {
          id
          userId
          title
          URL
          tags
    }
  }
`;

export const AddTabMutation = `
  mutation ($userId: ID,
    $title: String,
    $color: String,
    $column: Int,
    $priority: Int,
    $openedByDefault: Boolean,
    $deletable: Boolean,
    $type: String,
    $noteInput: String,
    $rssLink: String,
    $date: Boolean,
    $description: Boolean,
    $itemsPerPage: Int
    ) {
    addTab (userId: $userId, 
      title: $title,
      color: $color,
      column: $column,
      priority: $priority,
      openedByDefault: $openedByDefault,
      deletable: $deletable,
      type: $type,
      noteInput: $noteInput,
      rssLink: $rssLink,
      date: $date,
      description: $description,
      itemsPerPage: $itemsPerPage
        ) {
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
  }
`;

export const DeleteTabMutation = `
  mutation (
    $id: ID
    ) {
    deleteTab (id: $id ) {
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
  }
`;

export const ChangeTabMutation = `
  mutation (
    $id: ID,
    $userId: ID,
    $title: String,
    $color: String,
    $column: Int,
    $priority: Int,
    $openedByDefault: Boolean,
    $deletable: Boolean,
    $type: String,
    $noteInput: String,
    $rssLink: String,
    $date: Boolean,
    $description: Boolean,
    $itemsPerPage: Int
    ) {
    changeTab (
      id: $id,
      userId: $userId, 
      title: $title,
      color: $color,
      column: $column,
      priority: $priority,
      openedByDefault: $openedByDefault,
      deletable: $deletable,
      type: $type,
      noteInput: $noteInput,
      rssLink: $rssLink,
      date: $date,
      description: $description,
      itemsPerPage: $itemsPerPage
        ) {
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
  }
`;

export const LoginMutation = `
  mutation ($email_or_name: String, $password: String) {
    login(email_or_name: $email_or_name, password: $password) {
      ok
      userId
      token
      error
    }
  }
`;

export const LogoutMutation = `
  mutation {
    logout
  }
`;

export const BackgroundImgUploadMutation = `
  mutation ($image: Upload) {
    backgroundImgUpload(image: $image) {
      filename
    }
  }
`;

/* export const BackgroundImgMutation = `
  mutation ($file: Upload!) {
    backgroundImgUpload(file: $file)
  }
`; */

export const AddUserMutaton = `
  mutation ($name: String, $email: String, $password: String) {
    addUser(name: $name, email: $email, password: $password){
      id
      name
      email
      password
      error
    }
  }
`;

export const DeleteAccountByUserMutation = `
  mutation ($id: ID, $password: String) {
    deleteAccountByUser(id: $id, password: $password) {
      name
      error
    }
  }
`;

export const ChangeUserByUserMutation = `
  mutation ($id: ID, $name: String, $email: String, $passwordCurrent: String) {
    changeUserByUser (id: $id, name: $name, email: $email, passwordCurrent: $passwordCurrent) {
      name
      email
      error
    }
  }
`;

export const ChangePasswordByUserMutation = `
  mutation ($id: ID, $passwordCurrent: String, $passwordNew: String) {
    changePasswordByUser (id: $id, passwordCurrent: $passwordCurrent, passwordNew: $passwordNew) {
      name
      error
    }
  }
`;

export const ForgotPasswordMutation = `
mutation ($email: String) {
  forgotPassword (email: $email)
}
`;

export const ChangePasswordAfterForgotMutation = `
  mutation ChangePasswordAfterForgot($token: String, $newPassword: String) {
    changePasswordAfterForgot(token: $token, newPassword: $newPassword) {
      userId
      token
      error
    }
  }
`;

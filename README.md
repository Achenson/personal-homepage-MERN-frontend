# SmoothTabs - personal homepage [frontend]

This repository contains code for frontend part of an app hosted on Render. 

Backend part of the app:

https://github.com/Achenson/personal-homepage-MERN-backend

Previous monorepo code for Heroku (no longer working due to removal of Heroku free tier):

https://github.com/Achenson/personal-homepage-MERN

Known issues compared to Heroku version:

- After period of inactivity, backend part of the app spin up much slower. This results is noticable delay until the following functionalities are available: logging in, registering, token refreshing, rss fetching 

## Info

Manage bookmarks, RSS channels and notes in a form of draggable & foldable tabs.

Register to get persistent data storage and an option to upload an image as a background. Unregistered user's data is preserved in local storage.

- Drag the tabs between columns
- Choose between plain color or image background modes
- Set default opened/closed state for each tab, reset to default with one click
- Control individual or global tab colors and RSS settings
- Customize number, color and width of columns

WARNING: uploaded images are visible to the admin, as the app uses an imgBB account for image storage. Images need to be reuploaded after every 6 months.

Refer to app's tips & trick note for advanced usage.

App inspired by iGTab - https://igtab.com/

## Technologies used

- React with React Router
- Typescript
- Zustand (state management)
- Urql (GraphQL client)
- MongoDB 
- Express
- JSON Web Token (authentication)
- Tailwind CSS

## Live app

https://smoothtabs.onrender.com/

# ProjectPlanner
This is the repository of an app I made for a school project.
[See app on Play Store](https://play.google.com/store/apps/details?id=com.olimatthdev.ProjectPlanner&hl=ln&gl=US)

---
## Project description
ProjectPlanner is a mobile app made mostly for students. It aims to help the users to manage their projects. These can be for school, work or any other reason.

---
## Dependencies
* "@expo/vector-icons": "^13.0.0",
* "@react-native-async-storage/async-storage": "~1.17.3",
* "@react-native-picker/picker": "^2.4.2",
* "@react-navigation/drawer": "^6.3.1",
* "@react-navigation/native": "^6.0.8",
* "@react-navigation/native-stack": "^6.5.0",
* "expo": "^46.0.0",
* "expo-dev-client": "~1.1.1",
* "expo-dev-menu-interface": "^0.7.1",
* "expo-status-bar": "~1.4.0",
* "expo-updates": "~0.14.4",
* "firebase": "^9.6.7",
* "react": "18.0.0",
* "react-dom": "18.0.0",
* "react-native": "0.69.4",
* "react-native-elements": "^3.4.2",
* "react-native-gesture-handler": "~2.5.0",
* "react-native-modern-datepicker": "^1.0.0-beta.91",
* "react-native-paper": "^4.11.2",
* "react-native-progress": "^5.0.0",
* "react-native-reanimated": "~2.9.1",
* "react-native-safe-area-context": "^4.3.1",
* "react-native-screens": "~3.15.0",
* "react-native-svg": "^12.3.0",
* "react-native-vector-icons": "^9.1.0",
* "react-native-web": "^0.18.7"

---
## Basic Features
* Firebase Authentication
* CRUD project
* CRUD steps inside a project
* Create and update username

---
## Data structure
- **Users**
  - email as ID
    - UserId
    - displayName
- **Projects**
  - ownerId
  - projectName
  - projectDescription
  - projectCategory
  - projectStatus
    - To Do
    - In Progress
    - Done
  - projectCategoryColor
    - "white"
  - projectDeadline
  - Steps array
  - isDeleted
  - projectCompletion
- **Steps**
  - stepName
  - isChecked
  - stepDeadline

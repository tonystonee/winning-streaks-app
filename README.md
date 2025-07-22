Winning Streak App
Overview
"Winning Streak" is a simple, positive reinforcement web application designed to help you track and celebrate your small daily achievements, or "tiny wins." Instead of focusing on large, daunting goals, this app encourages you to acknowledge and record your daily successes, building a sense of momentum and accomplishment. It features a custom emoji tagging system and visual feedback to highlight your progress throughout the day.

This version of the app uses Local Storage for data persistence, meaning your wins are saved directly in your browser and are accessible offline.

Features
Track Daily Wins: Easily add new tiny wins with a description.

Custom Emoji Tagging: Tag each win with a positive emoji from a curated list.

Daily Win Counter: See your "Wins Today" count, which resets each new day.

Positive Reinforcement: The daily win counter changes color and displays encouraging messages as you hit different milestones (1, 5, 10, 25, 50, 100 wins).

Celebratory Animations: A subtle "pop" animation plays when you reach a new daily win milestone.

Local Storage Persistence: Your wins are saved in your browser's local storage, so they persist even if you close the app or go offline.

Delete Wins: Remove any recorded wins.

Clean & Modern UI: Built with Material-UI, featuring a psychologically positive color scheme and elegant typography.

Technologies Used
React: Frontend JavaScript library for building user interfaces.

Material-UI (MUI): React component library that implements Google's Material Design.

Local Storage: For client-side data persistence.

Google Fonts:

Baloo 2: For prominent headings ("Winning Streak", "Celebrate a Tiny Win!").

Quicksand: For the "Focus on today" subheading.

Raleway: For general body text.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Environment Details
This project is developed and tested in a Unix-like environment (macOS/Linux) using Bash as the shell. While it should work on Windows, a Unix-like environment is recommended for consistency with common development workflows.

Operating System: macOS / Linux (Windows with WSL2 is also compatible)

Shell: Bash (or Zsh with proper configuration)

Node.js: Version 20.x.x or newer (LTS recommended). It's highly recommended to use a Node Version Manager (like nvm for macOS/Linux or nvm-windows for Windows) to easily manage and switch Node.js versions.

npm: Comes bundled with Node.js.

Prerequisites
Node.js (version 20.x.x or newer recommended)

npm (Node Package Manager, comes with Node.js) or Yarn

Installation
Clone the repository (or create a new React app):
If you have the project files, navigate to the project directory. If starting fresh:

npx create-react-app winning-streak-app
cd winning-streak-app

Install dependencies:

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
# If you prefer yarn:
# yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material

Update src/App.js:
Replace the entire content of src/App.js with the code provided in the Canvas document.

Update public/index.html:
Ensure your public/index.html file includes the necessary font links within the <head> section and a <div id="root"></div> inside the <body> tag.

<!-- Add these lines inside the <head> tag -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap" />

And ensure this line is in the <body>:

<div id="root"></div>

Running the App Locally (Development Mode)
In the project directory, you can run:

npm start
# Or if you use yarn:
# yarn start

This command runs the app in development mode.

Open http://localhost:3000 to view it in your browser. The page will automatically reload when you make changes. You may also see any lint errors in the console.

Usage
Add a Tiny Win: Type your achievement into the text field.

Select an Emoji: Click the emoji button to choose a celebratory emoji.

Record: Click "Add Tiny Win!" to save your achievement.

Observe your Streak: Watch your "Wins Today" counter increase and enjoy the positive reinforcement messages and animations!

Delete Wins: Click the trash can icon next to a win to remove it.

Deployment
Since this version of the app uses Local Storage, it is a static web application. You can deploy it to any static site hosting service. Here are instructions for deploying to Firebase Hosting:

Deploying to Firebase Hosting
Install Firebase CLI:
If you haven't already, install the Firebase Command Line Interface globally:

npm install -g firebase-tools

Log in to Firebase:
Authenticate your Firebase CLI with your Google account:

firebase login

This will open a browser window for you to log in.

Initialize Firebase in your project:
Navigate to your project's root directory in the terminal and run:

firebase init

Follow the prompts carefully:

Which Firebase CLI features do you want to set up?

Select "Hosting: Configure and deploy Firebase Hosting sites" (press Spacebar to select, then Enter).

Do NOT select "Firestore" or "Functions" as this app uses local storage.

Please select a project: Choose your existing Firebase project (e.g., winning-streaks-app).

What do you want to use as your public directory? Type build and press Enter. (This is where your React app's compiled files will be).

Configure as a single-page app (rewrite all URLs to /index.html)? Type Y (Yes) and press Enter. (Essential for React apps).

Set up automatic builds and deploys with GitHub? Type N (No) and press Enter. (This avoids issues with service accounts if you're not using GitHub Actions).

Build your React application:
This command compiles your React code into optimized static files in the build folder. You must run this before deploying.

npm run build
# Or if you use yarn:
# yarn build

Deploy to Firebase Hosting:
Once the build is complete, deploy your app:

firebase deploy --only hosting

Firebase will provide you with a "Hosting URL" where your app is now live!

Customization
Emojis: Modify the positiveEmojis array in src/App.js to change the available emoji tags.

Colors: Adjust the theme object in src/App.js to change the Material-UI color palette.

Fonts: Change the fontFamily properties within the theme.typography object and update the Google Fonts links in public/index.html.

Milestones: Adjust the milestones array in src/App.js to change when the celebratory animations and messages trigger.
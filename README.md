# MeziChat chatting App

A mobile chat application that will provide users with a chat interface and image and location sharing options.

## Features

1. A page where users can enter their name and choose a background color for the chat screen before joining the chat.

2. A page displaying the conversation, as well as an input field and submit button.

3. The chat must provide users with two additional communication features:

    - sending images and location data
    - record and play sound messages

4. Data gets stored online and offline

## Tech Stacks

-   React Native
-   Expo
-   Google Firestore Database
-   Gifted Chat

## Getting started

1. Make sure you have Expo CLI installed

    `npm install -g expo-cli`

2. clone the repository

    `git clone https://github.com/Mezekr/portfolio-website.git`

3. Change the directory and run:

    `npm install`

4. Database configuration

-   Please cretae a Firebase Account & then a new project in the Firebase console: https://console.firebase.google.com/
-   Cloud Firestore DB: Initialize a new database and set its rules to: allow read, write: if true;
-   Firebase Authentication: Activate anonymous authentication for the app.
-   Firebase Storage: Activate storage by clicking on "Start now" and set its rules to: allow read, write: if true;
-   Configuration: create an .env file in root dir and copy the .env.example key and add your Firebase config files.

1. to Start the server

    `expo start`

2. Install the Expo Go app and then scan the QR code or enter the URL manually.

    or

-   Setup [Android Emulator ](https://developer.android.com/studio/intro) or

-   Setting up an iOS Simulator with use Xcode

## App User Interface

https://github.com/Mezekr/mezichat/assets/66778493/5aa302d8-1045-4c80-99de-b7dd834fe0d5


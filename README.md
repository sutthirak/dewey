# Dewey

Dewey is the application for booking a conference. it has been written with Node.js with MongoDB.
Also using Google User Account for adding speaker information and authentication.

## System Requirement

* Node.js
* MongoDB
* Google API Credential

## Google API Credential Setting

After you already got Google API Credential from this URL : https://console.developers.google.com. 
You have to set those values into `config.json` . that file should look similar this

```
    {"google-api":{
        "client-id":<PUT GOOGLE API CREDENTIAL CLIENT ID HERE>,
        "client-secret":<PUT GOOGLE API CREDENTIAL CLIENT SECRET HERE>,
        "redirect-url":<PUT GOOGLE API CREDENTIAL REDIRECT URL HERE>
        }
    }
```

## Installing Dependencies

Before start the application. You have to install dependencies with this commands.

```
npm install
```

## Starting the Application

After everything has been installed. you can start the application with this command.

```
npm start
```
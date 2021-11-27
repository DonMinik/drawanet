# Petri Net Draw Editor 
The I <3 Petri Nets Editor is an editor that allows a user to draw a petri net. 
It is based on behavior detections to provide an experience as close to actual paper drawing as possible.

##Concepts

##Development
###OCR with Tesseract.js

###Local development
You need to have nodejs and npm installed. 

Use npm i to install dependencies.

To run the application locally run npm start

###Installation
To create a deployment bundle you need to run npm run build. 
The bundle will then be located at /build folder

####Build and deploy to azure
There is an GitHub action defined and configured to build from this GitHub repository and afterwards deploy to a specific azure environment.
For other environments or forks this file must be edited!

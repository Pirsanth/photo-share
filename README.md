# PhotoShare
A fulllstack MEAN application for sharing photos and commenting on them

A bullet point summary of the project:
* My most cutting-edge full-stack project made with the **MEAN solution stack**. (**Angular2+**,  Express and MongoDb (used via the native driver not via Mongoose))

* Cutting-edge in the sense that I used **ES6 Javascript** (promises, async await etc.) and modern JS frameworks  (express and angular). It is Typescript heavy.

* I went with Angular because I wanted a more opinionated framework (compared to React) and I like that Typescript has first class support. In my previous project I encountered many bugs partly caused by Javascript’s dynamic typing.

* I used **Typescript on both the frontend and the backend** so that I’d have more experience with Typescript. On the backend I used ts-node to run the server and did not compile from TS to JS because I find that ts-node is far more strict in the sense that if you compiled to JS, the JS will still work even if the TS is not exactly valid (a function's signature does not match exactly for example)

* Modules used: the **Typescript flavour of ES6 Modules and ES6 classses**

* I used **Joi** in the backend for input validation

* Implements token based authentication via **JWT**

* The commit history is far cleaner than that of my other projects as I **rewrote the history** quite a bit using git rebase (both the usual and interactive)

* Did my best to **keep third party libraries minimal**. In particular I did not use those express-* npm packages that give you an express middleware out of the box. I did not use PassportJS, for example, as I wanted more work to do and I was just using a simple username and password form (no Oauth). Made the popup modals and the like myself instead of using Angular Materials

* In a previous project I used gulp so for this project I went with **npm scripts** for **task automation**  (that run my custom command-line nodeJS applications) to switch things up
* Used **CSS Grid** where the layout needed to be defined in two directions. Still used plain CSS, though I did supplemnent it with **font-awesome**.
___
## Quick start
> To **serve up** the already built application:
 1. Run **npm run init** in the base directory to create the required structure for the /public folder
 2. Run **npm install** in just the base directory (there is no need to install the dependencies in the Frontend subfolder where the angular project resides if you just want to serve the app).
 3. Run **npm run serve** to serve the application.
 4. By default the port of the node server is 3000, the port of the browserSync server that serves up the frontend is 4000 and the mongodb connection string is "mongodb://localhost:27017/photoShare". To change any of these values modify the .env file. These defaults can be changed without a rebuilt of the Angular frontend.

> Use **npm run reset** to reset the state of the application. It will clear all the contents of the app including user accounts, comments and uploaded pictures. (This has to be run in the same folder as the backend's files because angular has its own package.json as well)
___

## Checklist
- [ ] Add a spinner animation while the app waits for resolvers/navigation
- [ ] Add a progress bar for picture uploads
- [x] Build the angular application insteead of running it in developer mode
___

## Implementation Notes

### User Experience
Bullet points of UX considerations on the Angular frontend:
* For the frontend form validation messages, I designed it so that when the validation messages appear the form's other input fields do not move
* Following the above's reasoning of not causing the form's layout to change and jitter about, I made the messages of the message component appear as a stack
* Implemented reponsive design so that the app looks good on mobiles, tablets and computer screens
* In the album list component, for each album we show a preview of the last four pictures uploaded (which updates with the addition of each new picture)
* In the all the forms I show a confirmation dialog asking the user if he is sure he wants to leave if the form is dirty
* In the add a new picture form I make it easy for the user to add a new picture by letting the app set an automatic title for the picture. If the user only wants to add custom (his own) picture titles to a few of his/her uploads, I have that situation covered with an additional confirmation dialog
* In the picture detail component I keep fetching comments every 5 seconds. I only update the view if the comments have changed saving us an unnecessary change detection run

### JWT Implementation
The main problem with JWT tokens are that we can't invalidate an existing JWT token. I decided to address this issue by using a short-lived JWT access token and a longer lived refresh token. Refresh tokens are an Oauth2 concept that I borrowed. The short-lived refresh token is stateless meaning we do not do a call to the database whereas we do for the refresh token. The refresh token can thus be revoked restricting the time an attacker has access to less than or equal to the duration of the access token.

### On the npm run serve command and how I develop my application
#### How npm run serve works
There is a server for the backend that acts as the API server. The frontend is powered by Angular.

I use the Angular CLI to build the frontend Angular application. I have already committed the latest version of the built angular application to save anyone whom clones this repo the hassle of installing the dependencies of both the node server and the angular application and the subsequent building of said angular application.

I then use browser-sync as the HTTP server to serve up the built angular files. The browserSync instance also has a proxy for the node backend API server. The proxy exists because I want the angular application to not have to be rebuilt if the user were to change the port of the backend API server.

#### How I develop this application
I have two command lines up. The first runs npm run dev in the base directory which restarts the server if there are any file changes. The second is in the frontend directory (angular has its own package.json) and it runs ng serve. This is the reason why the backend has CORS. With the npm run serve command covered above, we use a proxy so CORS is unnecessary however I have left it in the final version of this app for simplicity. I also make sure apiUrl in "Frontend/src/environments/environment.ts" has the correct port for the node backend manually.

#### To rebuild the Angular application following a modification
There is an angular enviroment file for browserSync that I use to build angular. I have made the npm run build command in the frontend subdirectory build the angular project using this configuration.
___

## References
1. [A Stackoverflow that I referred to when figuring out how to proxy BrowserSync](https://stackoverflow.com/questions/25410284/gulp-browser-sync-redirect-api-request-via-proxy)
2. [One of the (many) articles that convinced me to try using npm scripts](https://medium.freecodecamp.org/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8)
3. These two links convinced me that I did not need Angular Materials for the modal component. I also took some of the CSS tips in these articles. [Link1](https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a) | [Link2](https://hackernoon.com/the-ultimate-guide-for-creating-a-simple-modal-component-in-vanilla-javascript-react-angular-8733e2859b421)

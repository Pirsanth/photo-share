
require("./model/sharedDB")
.initializeConnection()
.then(() => { require("./server")
               console.log("Server started")})
.catch((err) => {
console.log(err);
console.log("Error connecting to the database/typing, the server will not start");
})

//this catches errors even in routes.ts
//when you use ts-node when you make an error with typing it fails and catch runs

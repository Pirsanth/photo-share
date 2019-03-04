import {Request, Response} from "express";
import { User } from "../customTypes";
import * as model from "../model/manageUsers";
import jwt from "jsonwebtoken";
import util from "util";

const signToken = util.promisify(jwt.sign);
const verifyToken = util.promisify(jwt.verify);

async function signUp(req: Request, res: Response){
  try{
    const requestedUsername = req.body.username;
    const password = req.body.password;
    var user = new User(requestedUsername, password);

    const insertedCount = await model.addNewUser(user);

    if(insertedCount){
      const token = await makeToken(requestedUsername);
      res.status(200).json({error: null, data: {token, username: requestedUsername}})
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "Server error while adding new user"});
  }
}

async function signIn(req: Request, res: Response){
  try{
    const username = req.body.username;
    const password = req.body.password;

    const user: User|null = await model.findUser(username);

    if(user){
        if(user.password === password){
          let token = await makeToken(username);
          res.status(200).json({error:null, data: token});
        }
        else{
          /*I think 403 is more appropriate because Authorization will not help and the request SHOULD NOT be repeated.
            from RFC2616 (10.4.4 403 Forbidden)
          */
          res.status(403).json({error: "The credentials supplied were incorrect"});
        }
    }
    else{
      //you do not want to mention if the username exists
      res.status(403).json({error: "The credentials supplied were incorrect"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "Server error while validating user credentials"});
  }
}

async function makeToken(username: string){
  //expires in 1 hour
  const payload = {username, exp: ( (Date.now()/1000) + (60*60) )};
  return await signToken(payload, "secret");
}

export default {signUp, signIn};

import {Request, Response} from "express";
import { User } from "../customTypes";
import * as userModel from "../model/manageUsers";
import * as refreshTokenModel from "../model/manageRefreshTokens";
import jwt from "jsonwebtoken";
import util from "util";
import uuid from "uuid/v4";
import { RefreshTokensDocument } from "../customTypes";


const signToken = util.promisify(jwt.sign);
const verifyToken = util.promisify(jwt.verify);

async function signUp(req: Request, res: Response){
  try{
    const requestedUsername = req.body.username;
    const password = req.body.password;
    var user = new User(requestedUsername, password);

    const insertedCount = await userModel.addNewUser(user);

    if(insertedCount){
      const tokensArray = await Promise.all([
        makeAccessToken(requestedUsername),
        createAndRegisterRefreshToken(requestedUsername)
      ]);
      res.status(200).json(
        {error: null,
         data:
          {username: requestedUsername, accessToken: tokensArray[0], refreshToken: tokensArray[1]}
        });
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

    const user: User|null = await userModel.findUser(username);

    if(user){
        if(user.password === password){
          const tokensArray = await Promise.all([
            makeAccessToken(username),
            createAndRegisterRefreshToken(username)
          ]);
          res.status(200).json(
            {error: null,
             data:
              {username, accessToken: tokensArray[0], refreshToken: tokensArray[1]}
            });
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

async function makeAccessToken(username: string){
  //expires in 1 hour
  const payload = {username, exp: ( (Date.now()/1000) + (60*60) )};
  return await signToken(payload, "secret");
}
async function createAndRegisterRefreshToken(username:string){
    const refreshTokenId = uuid();
    return await Promise.all([
      refreshTokenModel.registerNewRefreshToken(refreshTokenId, username),
      makeRefreshToken( refreshTokenId )
    ]).then(arr => arr[1]);
}
async function makeRefreshToken(uid: string){
  const payload = {exp: ( (Date.now()/1000) + (60*60*24) ), jti: uid};
  return await signToken(payload, "anotherSecret");
}

export default {signUp, signIn};

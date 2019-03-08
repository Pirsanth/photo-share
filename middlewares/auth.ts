import jwt from "jsonwebtoken";
import { MiddlewareFunction } from "../customTypes";
import util from "util";
import { VerifyOptions } from "jsonwebtoken";
import { extractBearerSchemeToken } from "../helpers";

type payload = {username:string};

const verifyToken = util.promisify<string,string,VerifyOptions, payload>(jwt.verify);

export let checkAccessToken:MiddlewareFunction = async function (req, res, next){
    var header = req.header("authorization");

    var accessToken = extractBearerSchemeToken(header);
    
    if(accessToken){
      try{
        var payload = await verifyToken(accessToken, "secret", {});
        req.payload = payload;
        next();
      }
      catch(error){
        res.status(401).json({error:error.message})
      }
    }
    else{
        res.status(401).json({error: "No jwt access token was found"});
    }
}

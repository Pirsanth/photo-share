import jwt from "jsonwebtoken";
import { MiddlewareFunction } from "../customTypes";
import util from "util";
import { VerifyOptions } from "jsonwebtoken";

type payload = {username:string};

const verifyToken = util.promisify<string,string,VerifyOptions, payload>(jwt.verify);
const regex = /^Bearer\s{1}([\w.]+)$/;

export let checkToken:MiddlewareFunction = async function (req, res, next){
    var header = req.header("authorization");

    if(regex.test(header)){
      const [,receivedToken] = header.match(regex);

      try{
        var payload = await verifyToken(receivedToken, "secret", {});
        req.payload = payload;
        next();
      }
      catch(error){
        res.status(401).json({error:error.message})
      }

    }
    else{
      res.status(401).json({error: "No jwt token was found"});
    }
}

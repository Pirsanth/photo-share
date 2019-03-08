import { Request, request } from "express";
const regex = /^Bearer\s{1}(.+)$/;

export function extractBearerSchemeToken(authorizationHeader:string):string|null{
  if(regex.test(authorizationHeader)){
    const [,receivedToken] = authorizationHeader.match(regex);
    return receivedToken;
  }
  else{
    return null;
  }
}

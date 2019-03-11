import { Injectable } from '@angular/core';
import { tap } from "rxjs/operators";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from "@angular/common/http";
import { AlbumsService } from "../services/albums.service";
import { CachedRequestsService } from "./cached-requests.service";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class ResendCachedService implements HttpInterceptor{
/*
*  If the user logs in again with the same username as before the cached request is r
*/

  constructor(private ajax:AlbumsService, private cache:CachedRequestsService, private auth:AuthenticationService) { }
  intercept(req:HttpRequest<any>, next:HttpHandler){
    if(this.isLoginOrRegister(req.url)){
      return next.handle(req).pipe(
        tap( event => {
          if(event instanceof HttpResponse && event.status === 200){

              const newLoggedInUser = event.body.data.username;
              const isCachedUser = this.cache.isCachedUser(newLoggedInUser);

              this.auth.setUserData(event.body.data);

              if(isCachedUser){
                  this.cache.sendAllCachedRequests();
              }
              else{
                this.cache.dropAllCachedRequests();
              }
          }
        }))

    }
    else{
      return next.handle(req);
    }
  }
  private isLoginOrRegister(currentUrl:string):boolean{
    const arrayOfRoutes:Array<string> = ["/auth/signUp", "/auth/signIn"];
    return arrayOfRoutes.some((uriToAvoid) => currentUrl === this.ajax.baseURL + uriToAvoid);
  }
}

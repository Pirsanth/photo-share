import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest,
   HttpHandler, HttpErrorResponse, HttpUserEvent, HttpResponse } from "@angular/common/http";
import { tap, catchError, mergeMap, filter, take, switchMap } from "rxjs/operators";
import { of,throwError, BehaviorSubject, EMPTY } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { AlbumsService } from "../services/albums.service";
import { Router } from "@angular/router";
import { CachedRequestsService } from "./cached-requests.service";
import { MessageService } from "../services/message.service";

/*
  This class appends the jwt token to the header of the relevant request.
  It also refreshes the access token if it is no longer valid. During refreshing, additional requests are cached
  If the refresh token is no longer valid, it logs the user out and caches the requests in the correct order.
  On subsequent login, if the username is the same it sends all the cached requests. If the login is as a different user,
  all cached requests are lost.

  It sends the requests out from the client in the correct order (as made) whether the server recieves it
  in the correct order, I cannot confirm in production but it does locally. This is especially
  relevant with liking comments as the delete and post requests could be recieved by the server
  out of order.
*/

@Injectable()
export class AuthHeaderService implements HttpInterceptor {

  refreshingToken:boolean = false;
  accessToken$ = new BehaviorSubject(null);
  cachedRequest:HttpRequest<any>;
  constructor(private auth:AuthenticationService,private ajax: AlbumsService, private router:Router, private cache:CachedRequestsService, private message:MessageService) {
  }

  intercept(req:HttpRequest<any>, next:HttpHandler){

    if(this.needsAccessToken(req.method, req.url)){
        if(this.refreshingToken){
          this.cache.addToCache(req);
          return EMPTY;
        }
        else{
          return next.handle(this.appendToken(req))
          .pipe( catchError( (err:HttpErrorResponse) =>{

            if(err.status === 401){
              return this.tryRefreshToken(req, next);
            }
            else {
              return throwError(err);
            }
          }))
        }
    }
    else{
      return next.handle(req);
    }
  }

  private appendToken(req:HttpRequest<any>):HttpRequest<any> {
    const accessToken = this.auth.accessToken;
    return req.clone({setHeaders:{"Authorization": `Bearer ${accessToken}`}});
  }
  private isAuthenticationRoute(currentUrl:string):boolean{
    const arrayOfAuthRoutes:Array<string> = ["/auth/signUp", "/auth/signIn", "/auth/logout", "/auth/refresh"];
    return arrayOfAuthRoutes.some((uriToAvoid) => currentUrl === this.ajax.baseURL + uriToAvoid);
  }
  private tryRefreshToken(req:HttpRequest<any>, next:HttpHandler){
    this.refreshingToken = true;
    return this.auth.attemptRefreshToken()
          .pipe( switchMap(( token ) => {
            this.refreshingToken = false;
            //In between the refresh attempt there could be other requests coming in
            
            return next.handle(this.appendToken(req))
            .pipe( tap( event => {
                    //let send them all in order
                if(this.cache.hasCachedRequests()){
                  this.cache.sendAllCachedRequests();
                }

               }))
          }))
          .pipe( catchError( (err:HttpErrorResponse) =>{
              this.refreshingToken = false;
              //if the refresh token has expired, we add the request to the cache
              //the cache may have other requests that were saved during the duration of the refresh attempt
              if(err.status === 403){
                this.cache.addToFrontOfCache(req);
                this.auth.clearUserData();
                this.message.addMessage("The app requires a relogin every 24 hours. If you do not login as the same user the pending post is lost");
                this.router.navigate(["/user", "authenticate"]);
              }
              return throwError(err);
          }))
  }
  private needsAccessToken(method:string, url:string):boolean{
    return method !== "GET" && !this.isAuthenticationRoute(url);
  }
}

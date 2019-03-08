import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest,
   HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError, mergeMap, filter, take, switchMap } from "rxjs/operators";
import { of,throwError, BehaviorSubject } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { AlbumsService } from "../services/albums.service";
import { Router } from "@angular/router";

/*
  This class appends the jwt token to the header of the relevant request.
  It also refreshes the access token if it is no longer valid.
  If the refresh token is no longr valid, it logs the user out
*/

@Injectable()
export class AuthHeaderService implements HttpInterceptor {

  refreshingToken:boolean = false;
  accessToken$ = new BehaviorSubject(null);
  cachedRequest:HttpRequest<any>;
  constructor(private auth:AuthenticationService,private ajax: AlbumsService, private router:Router) { }

  intercept(req:HttpRequest<any>, next:HttpHandler){

    if(req.method !== "GET" && !this.isAuthenticationRoute(req.url)){
        if(this.refreshingToken){
          this.accessToken$
          .pipe( filter( x => x !== null) )
          .pipe( take(1) )
          .pipe( switchMap(x => next.handle(this.appendToken(req)) ) )
        }
        else{
          return next.handle(this.appendToken(req))
          .pipe( catchError( (err:HttpErrorResponse) =>{

            if(err.status === 401){
              return this.useRefreshToken(req, next);
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
  private useRefreshToken(req:HttpRequest<any>, next:HttpHandler){
    this.refreshingToken = true;
    this.accessToken$.next(null);
    return this.auth.attemptRefreshToken()
          .pipe( switchMap(( token ) => {
            this.refreshingToken = false;
            this.accessToken$.next(token);
            return next.handle(this.appendToken(req))
          }))
          .pipe( catchError( (err:HttpErrorResponse) =>{
              if(err.status === 403){
                this.auth.clearUserData();
                this.router.navigate(["/user", "authenticate"],
                {state: {message: "The app requires a relogin every 24 hours"}});
              }
              return throwError(err);
          }))
  }
}

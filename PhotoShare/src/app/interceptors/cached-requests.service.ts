import { Injectable } from '@angular/core';
import { HttpRequest, HttpBackend, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { from, throwError, of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CachedRequestsService {
  username:string;
  sentRequests: number = 0;
  private requests:HttpRequest<any>[] = [];
  constructor(private backend:HttpBackend, private auth:AuthenticationService) {
    this.username = this.auth.currentUser;
  }

  sendAllCachedRequests(){
    from(this.requests)
    .pipe(
      mergeMap( req => {

        if(this.sentRequests === this.requests.length-1){
            this.requests = [];
            this.sentRequests = 0;
        }
        this.sentRequests++;
        return this.backend.handle(this.appendToken(req))
      }),
      catchError( err => {
        console.log(err)
        return throwError("Error retrying cached requests")} )
    )
    .subscribe( x => {
      if( x instanceof HttpResponse ){
        console.log("One cached request completed");
      }
    })
  }
  addToCache(req:HttpRequest<any>):void{
    this.requests.push(req);
  }
  addToFrontOfCache(req:HttpRequest<any>):void{
    this.requests.unshift(req);
  }
  hasCachedRequests():boolean{
    return !!this.requests.length
  }
  isCachedUser(user:string):boolean{
    return this.username === user;
  }
  dropAllCachedRequests(){
    this.requests = [];
  }
  private appendToken(req:HttpRequest<any>):HttpRequest<any> {
    const accessToken = this.auth.accessToken;
    return req.clone({setHeaders:{"Authorization": `Bearer ${accessToken}`}});
  }

}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpBackend } from "@angular/common/http";
import { from, throwError } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CachedRequestsService {

  username:string;
  private requests:HttpRequest<any>[] = [];
  constructor(private backend:HttpBackend) { }

  sendAllCachedRequests(){
    from(this.requests)
    .pipe(
      mergeMap( req => {
        return this.backend.handle(req)
      }),
      catchError( err => throwError("Error retrying cached requests"))
    )
    .subscribe( x =>{
      console.log("Done the cached");
      console.log(x);
    },
  err => console.log(err)
)
  }
  addToCache(req:HttpRequest<any>):void{
    this.requests.push(req);
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


}

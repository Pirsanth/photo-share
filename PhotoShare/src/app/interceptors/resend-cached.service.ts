import { Injectable } from '@angular/core';
import { tap } from "rxjs/operators";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from "@angular/common/http";
import { AlbumsService } from "../services/albums.service";
import { CachedRequestsService } from "./cached-requests.service";

@Injectable()
export class ResendCachedService implements HttpInterceptor{

  constructor(private ajax:AlbumsService, private cache:CachedRequestsService) { }
  intercept(req:HttpRequest<any>, next:HttpHandler){
    if(this.isLoginOrRegister(req.url)){
      return next.handle(req).pipe(
        tap( event => {
          if(event instanceof HttpResponse && event.status === 200){
            console.log(this.cache.hasCachedRequests())
              const newLoggedInUser = event.body.data.username;
              if(this.cache.isCachedUser(newLoggedInUser)){
                  this.cache.sendAllCachedRequests();
              }
              else{
                this.cache.dropAllCachedRequests();
              }
              this.cache.username = newLoggedInUser;
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

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { MessageService } from "../services/message.service";
import { FeatureArea } from "../customTypes"

@Injectable({
  providedIn: 'root'
})
export class AddNewPictureGuard implements CanActivate {
  constructor(private auth:AuthenticationService, private router:Router, private message:MessageService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const isLoggedIn:boolean = !!this.auth.currentUser;

      if(isLoggedIn){
        return true;
      }
      else{
        this.message.addMessage("You must be logged in to post a picture", FeatureArea.users);
        this.router.navigate(["/user", "authenticate"]);
        return false;
      }
  }

}
//{state: {}}

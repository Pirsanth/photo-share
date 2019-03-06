import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AddNewPictureGuard implements CanActivate {
  constructor(private auth:AuthenticationService, private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const isLoggedIn:boolean = !!this.auth.currentUser;

      if(isLoggedIn){
        return true;
      }
      else{
        this.router.navigate(["/user", "authenticate"], {state: {message: "You must be logged in to post a picture"}});
        return false;
      }
  }

}

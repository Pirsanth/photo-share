import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthShellGuard implements CanActivate {
  constructor(private auth:AuthenticationService, private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const isLoggedIn:boolean = !!this.auth.currentUser;

      if(isLoggedIn){
        this.router.navigate(["/user", "currentUser"]);
        return false;
      }
      else{
        return true;
      }
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot,
   RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from "../services/authentication.service";


@Injectable({
  providedIn: 'root'
})
export class UserDetailsGuard implements CanActivate {
  constructor(private auth:AuthenticationService, private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

      const isLoggedIn:boolean = !!this.auth.currentUser;

      if(isLoggedIn){
        return true;
      }
      else{
        this.router.navigate(["/user", "/authenticate"])
        return false;
      }

  }
}

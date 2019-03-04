import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AjaxService } from "./ajax.service";
import { Observable } from "rxjs";
import { tap, pluck } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser:string = null;

  constructor(private http:HttpClient, private ajax:AjaxService) { }

  signUp(formData: FormData){
    const postUrl = this.ajax.baseURL + "/auth/signUp";

    return this.http.post(postUrl, formData, {observe: "body", responseType: "json"})
    .pipe( pluck("data") )
    .pipe(tap( x => {this.currentUser = x["username"];}))
  }

}

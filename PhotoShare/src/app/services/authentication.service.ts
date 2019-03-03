import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser:string = null;
  constructor(private http:HttpClient) { }

  signUp(formData){

  }

}

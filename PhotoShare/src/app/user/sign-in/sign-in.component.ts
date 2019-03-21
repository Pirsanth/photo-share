import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  userCredentials = this.fb.group({
    username: [""],
    password: [""]
  })
  isValid: boolean = true;
  message:string;
  constructor(private auth:AuthenticationService, private fb:FormBuilder
  ,private router:Router) {
//  console.log(this.router.getCurrentNavigation());
}
  ngOnInit() {
    this.message = window.history.state.message;
  }
  handleSubmit(){
    this.auth.signIn(this.userCredentials.value)
    .subscribe( x => {
      console.log("The sign in was successful")
      this.router.navigate(["/pictures"])
    })
  }

}

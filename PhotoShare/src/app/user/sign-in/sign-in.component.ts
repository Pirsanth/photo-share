import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder, Validators, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  userCredentials = this.fb.group({
    username: ["", Validators.required ],
    password: ["", [Validators.required, Validators.minLength(4)] ]
  })
  message:string = "You must be logged in to post a picture";

  constructor(private auth:AuthenticationService, private fb:FormBuilder
  ,private router:Router) {}

  get username() {
    return this.userCredentials.get("username");
  }
  get password(){
    return this.userCredentials.get("password");
  }
  ngOnInit() {
    this.message = window.history.state.message;
  }
  handleSubmit(){
    if(this.userCredentials.valid){
      this.auth.signIn(this.userCredentials.value)
      .subscribe( x => {
        console.log("The sign in was successful")
        this.router.navigate(["/pictures"])
      },
      err => {
          if(err.status === 403){
            this.clearForm();
            this.message = "The credentials supplied were incorrect"
          }
      })
    }
    else {
      this.showValidationMessages();
    }
  }
  makeErrorMessage(error: ValidationErrors){
    if(error.hasOwnProperty("required")){
      return `Password can't be left blank`
    }
    else if(error.hasOwnProperty("minlength")){
      return `Password must be at least ${error.minlength.requiredLength} characters long`
    }
  }
  showValidationMessages():void{
    this.username.markAsTouched();
    this.password.markAsDirty();
  }
  clearForm(){
    this.userCredentials.reset();
  }
}

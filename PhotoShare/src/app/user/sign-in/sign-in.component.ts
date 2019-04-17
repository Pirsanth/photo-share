import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder, Validators, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "../../services/message.service";
import { Observable } from "rxjs";
import { AuthModalService } from "../../services/auth-modal.service";
import { FormComponent } from "../../customTypes";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, FormComponent {

  userCredentials = this.fb.group({
    username: ["", Validators.required ],
    password: ["", [Validators.required, Validators.minLength(4)] ]
  })

  constructor(private auth:AuthenticationService, private fb:FormBuilder
  ,private router:Router, private message:MessageService, private modal:AuthModalService) {}

  get username() {
    return this.userCredentials.get("username");
  }
  get password(){
    return this.userCredentials.get("password");
  }
  ngOnInit() {
  }
  handleSubmit(){
    if(this.userCredentials.valid){
      this.auth.signIn(this.userCredentials.value)
      .subscribe( x => {
        this.userCredentials.reset();
        console.log("The sign in was successful")
        this.router.navigate(["/pictures"])
      },
      err => {
          if(err.status === 403){
            this.clearForm();
            this.message.addMessage("The username and password was incorrect");
          }
          else{
            this.message.addMessage("An error occured while attempting to sign in");
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
  canDeactivate():Observable<boolean> | boolean {
    if(this.userCredentials.dirty){
      return this.modal.getUserResponse();
    }
    else{
      return true;
    }
  }
}

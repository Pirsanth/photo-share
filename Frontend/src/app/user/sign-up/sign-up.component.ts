import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup, ValidationErrors, FormControl, AbstractControl, AsyncValidator } from "@angular/forms";
import { isUsernameAvailable } from "./isUsernameAvailable";
import { MessageService } from "../../services/message.service";
import { AuthModalService } from "../../services/auth-modal.service";
import { FormComponent, FeatureArea } from "../../customTypes";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, FormComponent {

  previewSrc: string | ArrayBuffer;
  isValid:boolean = true;
  registrationForm = this.fb.group({
      username: ["", Validators.required, this.asyncUsernameValidator.validate.bind(this.asyncUsernameValidator)],
      passwordGroup: this.fb.group({
        password: ["", [Validators.required, Validators.minLength(4)] ],
        repeatPassword: ["", [Validators.required, Validators.minLength(4)] ],
      }, {validators: this.passswordsValidator}),
      profilePicture: ["", [Validators.required] ]
  })

  constructor(private auth:AuthenticationService, private router:Router,
    private fb:FormBuilder, private asyncUsernameValidator:isUsernameAvailable, private message:MessageService, private modal:AuthModalService) {}

  ngOnInit() {
  }
  get profilePicture(){
    return this.registrationForm.get("profilePicture");
  }
  get username(){
    return this.registrationForm.get("username");
  }
  get passwordGroup(){
    return this.registrationForm.get("passwordGroup");
  }
  get repeatPassword(){
    return this.registrationForm.get("passwordGroup.repeatPassword");
  }

/*
  The below validator function sets errors for the parent form group itself. The errors carry the validation messages to display in the UI
  The validator fn also sets the passwordsDoNotMatch error on the repeatPassword child form control for CSS styling purposes

  Valid and invalid in the if statements below simply refer to validity with respect to required and minlength, the validators on the child form controls themselves
  (which is why we updateValueAndValidity if the customError passwordsDoNotMatch was set)

  If both form controls are valid we check if the passwords match and display error messages accordingly.
  If any of the two form controls are not valid, we just repeat the errors on the from controls in a user friendly message
*/
  passswordsValidator(group: FormGroup){
    const password = group.get("password");
    const repeatPassword = group.get("repeatPassword");

    if(repeatPassword.invalid && "passwordsDoNotMatch" in repeatPassword.errors){
      /*
        if password is modified while repeatPassword has the customError, we reset the validity of repeatPassword with respect to the custom error
        the validators on the repeatPassword form control still have to pass

        Note: If repeatPassword is modified, the custom error gets shaken off
      */
      repeatPassword.updateValueAndValidity({onlySelf: true});
    }

    if( password.valid && repeatPassword.valid ){
        if(password.value === repeatPassword.value){
          return null;
        }
        else{
          repeatPassword.setErrors({passwordsDoNotMatch: true});
          return {repeatPassword: "Passwords do not match"};
        }
    }
    else{
        if( password.invalid && repeatPassword.invalid ){
          return {
                  password: makeErrorMessage("Password", password.errors),
                  repeatPassword: makeErrorMessage("Repeat password", repeatPassword.errors)
                }
        }
        else{
          if(password.invalid){
            return {password: makeErrorMessage("Password", password.errors)}
          }
          else{
            return {repeatPassword: makeErrorMessage("Repeat password", repeatPassword.errors)};
          }
        }
    }
    function makeErrorMessage(controlName: string, error: ValidationErrors):string{
        if(error.hasOwnProperty("required")){
          return `${controlName} can't be left blank`;
        }
        //don't use else, be explicit
        else if(error.hasOwnProperty("minlength")){
          return `${controlName} must be at least ${error.minlength.requiredLength} characters long`;
        }
    }
  }
  readFileIntoAURL(file:File){
    var fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = (progressEvent) => {
        var fileReader = progressEvent.target as FileReader;
        this.previewSrc = fileReader.result;
      }
      fileReader.onerror = (err) => {
        console.error(err);
      }
  }
  handleSubmit(form: HTMLFormElement){
    if(this.registrationForm.valid){
      var formData = new FormData(form);
      this.auth.signUp(formData).subscribe(
        x => {
          this.registrationForm.reset();
          console.log("Sign up was a success")
          this.router.navigate(["/pictures"])
        },
        err => {
          this.message.addMessage("An error occured while attempting to create a new user", FeatureArea.users);
        }
      );
    }
    else{
        this.showValidationMessages();
    }
  }
  touchedOrDirty(control: AbstractControl):boolean{
    return control.dirty || control.touched
  }

  showValidationMessages(controls:{[key:string]: AbstractControl} = this.registrationForm.controls ){

      Object.values(controls).forEach( control => {
          if("controls" in control){
            //then it is the password sub-form group
            let group = control as FormGroup;
            return this.showValidationMessages(group.controls)
          }
          control.markAsDirty();
      })

  }
  canDeactivate(){
    if(this.registrationForm.dirty){
      return this.modal.getUserResponse();
    }
    else {
      return true;
    }
  }
}

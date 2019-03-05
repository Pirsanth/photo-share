import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthShellComponent } from './auth-shell/auth-shell.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignInComponent, SignUpComponent, AuthShellComponent, UserDetailsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }

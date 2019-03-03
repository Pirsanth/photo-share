import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./user-details/user-details.component";
import { AuthShellComponent } from "./auth-shell/auth-shell.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { UserDetailsGuard } from "../guards/user-details.guard";

const routes: Routes = [
  {path: "currentUser", component:UserDetailsComponent, canActivate:[UserDetailsGuard]},
  {path:"authenticate", component:AuthShellComponent,
  children:[
    {path:"signUp", component:SignUpComponent},
    {path:"signIn", component:SignInComponent},
    {path:"", component:SignInComponent, pathMatch:"full"}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

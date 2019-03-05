import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./user-details/user-details.component";
import { AuthShellComponent } from "./auth-shell/auth-shell.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { UserDetailsGuard } from "../guards/user-details.guard";
import { AuthShellGuard } from "../guards/auth-shell.guard";
//, canActivate:[UserDetailsGuard]

const routes: Routes = [{
  path: "user", children:[
    {path:"authenticate", component:AuthShellComponent, canActivate: [AuthShellGuard] ,children:[
      {path:"signUp", component:SignUpComponent},
      {path:"signIn", component:SignInComponent},
      {path:"", component:SignInComponent}
    ]},
    {path: "currentUser", component: UserDetailsComponent, canActivate: [UserDetailsGuard]}
  ]
}]



/*
{path:"base", component:AuthShellComponent, canActivate:[UserDetailsGuard]
,children:[
{path:"signUp", component:SignUpComponent, canActivate:[UserDetailsGuard]},
{path:"signIn", component:SignInComponent, canActivate:[UserDetailsGuard]},
{path: "currentUser", component:UserDetailsComponent, canActivate:[UserDetailsGuard]},
//{path:"", component:SignInComponent, pathMatch:"full"}

], data: {
state:a
}
}]
[
  {path:"base", component:AuthShellComponent, canActivate:[UserDetailsGuard]
    ,children:[
      {path:"signUp", component:SignUpComponent, canActivate:[UserDetailsGuard]},
      {path:"signIn", component:SignInComponent, canActivate:[UserDetailsGuard]},
      {path: "currentUser", component:UserDetailsComponent, canActivate:[UserDetailsGuard]},
      //{path:"", component:SignInComponent, pathMatch:"full"}

    ], data: {
      state:a
    }
  }]
*/

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

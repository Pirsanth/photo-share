import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from "./user-details/user-details.component";
import { AuthShellComponent } from "./auth-shell/auth-shell.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { UserDetailsGuard } from "../guards/user-details.guard";
import { AuthShellGuard } from "../guards/auth-shell.guard";
import { DirtyFormGuard } from "../guards/dirty-form.guard";

const routes: Routes = [{
  path: "user", children:[
    {path:"authenticate", component:AuthShellComponent, canActivate: [AuthShellGuard] ,children:[
      {path:"signUp", component:SignUpComponent, canDeactivate: [DirtyFormGuard]},
      {path:"signIn", component:SignInComponent, canDeactivate: [DirtyFormGuard]},
      {path:"", component:SignInComponent}
    ]},
    {path: "currentUser", component: UserDetailsComponent, canActivate: [UserDetailsGuard]}
  ]
}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormComponent} from "./form/form.component";
import { FormResolverService } from "./resolvers/form-resolver.service";

const routes: Routes = [
  {path: "addNew", component: FormComponent, resolve: { albumList: FormResolverService}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComponent } from "./form/form.component";
import { FormResolverService } from "../resolvers/form-resolver.service";
import { AddNewPictureGuard } from "../guards/add-new-picture.guard";
import { MessageComponent } from "../widgets/message/message.component";

const routes: Routes = [
  { path: "addNew", component: FormComponent,
    canActivate: [AddNewPictureGuard],
    resolve: { albumList: FormResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPicturesRoutingModule { }

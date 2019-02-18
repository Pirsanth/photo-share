import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PictureShellComponent} from "./picture-shell/picture-shell.component";
import {PictureListComponent} from "./picture-list/picture-list.component";
import {PictureDetailComponent} from "./picture-detail/picture-detail.component";
import {AlbumListComponent} from "./album-list/album-list.component";

const routes: Routes = [
  {path:"pictures", component: PictureShellComponent,
  children: [{path: "albums", component: AlbumListComponent},
             {path: "", component: AlbumListComponent}
            ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicturesRoutingModule { }

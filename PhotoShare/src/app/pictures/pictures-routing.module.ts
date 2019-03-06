import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PictureShellComponent} from "./picture-shell/picture-shell.component";
import {PictureListComponent} from "./picture-list/picture-list.component";
import {PictureDetailComponent} from "./picture-detail/picture-detail.component";
import {AlbumListComponent} from "./album-list/album-list.component";
import { PictureListResolverService } from "../resolvers/picture-list-resolver.service";
import { PictureDetailResolverService } from "../resolvers/picture-detail-resolver.service";

const routes: Routes = [
  {path:"pictures", component: PictureShellComponent,
  children: [{path: "albums", component: AlbumListComponent},
             {path: "albums/:albumName", component: PictureListComponent, resolve: {album: PictureListResolverService} },
             {path: "albums/:albumName/:pictureTitle", component: PictureDetailComponent, resolve: {commentDoc: PictureDetailResolverService}},
             {path: "", redirectTo: "albums", pathMatch: "full"},
            ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicturesRoutingModule { }

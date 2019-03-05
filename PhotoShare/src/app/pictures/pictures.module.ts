import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PicturesRoutingModule } from './pictures-routing.module';
import { PictureShellComponent } from './picture-shell/picture-shell.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlbumListComponent } from './album-list/album-list.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { PictureDetailComponent } from './picture-detail/picture-detail.component';
import { AlbumListItemComponent } from './album-list-item/album-list-item.component';
import { PictureListItemComponent } from './picture-list-item/picture-list-item.component';
import { ReactiveFormsModule } from "@angular/forms";
import { addLocalhostPipe } from "../pipes/addLocalhost"

@NgModule({
  declarations: [PictureShellComponent, AlbumListComponent, PictureListComponent,
    PictureDetailComponent, AlbumListItemComponent, PictureListItemComponent, addLocalhostPipe],
  imports: [
    CommonModule,
    PicturesRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class PicturesModule { }

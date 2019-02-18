import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PicturesRoutingModule } from './pictures-routing.module';
import { PictureShellComponent } from './picture-shell/picture-shell.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlbumListComponent } from './album-list/album-list.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { PictureDetailComponent } from './picture-detail/picture-detail.component';
@NgModule({
  declarations: [PictureShellComponent, AlbumListComponent, PictureListComponent, PictureDetailComponent],
  imports: [
    CommonModule,
    PicturesRoutingModule,
    FontAwesomeModule
  ]
})
export class PicturesModule { }

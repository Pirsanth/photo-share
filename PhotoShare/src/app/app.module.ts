import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusSquare, faUser, faImages, faFolder, faClock, faCamera, faArrowUp,
  faArrowDown, faThumbsUp, faTrashAlt, faUserPlus, faUserCircle, faInfoCircle,
  faBars, faPortrait, faImage, faEnvelope, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {PicturesModule} from "./pictures/pictures.module";
import { UserModule } from "./user/user.module";
import { httpInterceptors } from "./interceptors/providersArray";
import { AddPicturesModule } from "./add-pictures/add-pictures.module";

library.add(faPlusSquare, faUser, faImages, faFolder, faClock, faCamera, faArrowUp,
   faArrowDown, faThumbsUp, faTrashAlt, faUserPlus, faUserCircle, faInfoCircle, faBars, faPortrait, faImage, faEnvelope,
   faArrowCircleLeft, faArrowCircleRight);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    PicturesModule,
    UserModule,
    ReactiveFormsModule,
    AddPicturesModule
  ],
  providers: [httpInterceptors],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';

import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusSquare, faUser, faImages, faFolder, faClock, faCamera, faArrowUp,
  faArrowDown, faThumbsUp, faTrashAlt, faUserPlus, faUserCircle, faInfoCircle, faBars} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {PicturesModule} from "./pictures/pictures.module"
import { UserModule } from "./user/user.module";
import { addLocalhostPipe } from "./pipes/addLocalhost";
import { httpInterceptors } from "./interceptors/providersArray";

library.add(faPlusSquare, faUser, faImages, faFolder, faClock, faCamera, faArrowUp,
   faArrowDown, faThumbsUp, faTrashAlt, faUserPlus, faUserCircle, faInfoCircle, faBars);

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    PicturesModule,
    UserModule
  ],
  providers: [httpInterceptors],
  bootstrap: [AppComponent]
})
export class AppModule { }

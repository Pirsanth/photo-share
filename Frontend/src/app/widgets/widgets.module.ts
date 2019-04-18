import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "./modal/modal.component";
import { MessageComponent } from "./message/message.component";
//import { SpinnerComponent } from "./spinner/spinner.component";

@NgModule({
  declarations: [
    ModalComponent,
    MessageComponent,
//    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    MessageComponent,
//    SpinnerComponent
  ]
})
export class WidgetsModule { }

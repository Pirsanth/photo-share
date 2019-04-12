import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "./modal/modal.component";
import { MessageComponent } from "./message/message.component";

@NgModule({
  declarations: [
    ModalComponent,
    MessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    MessageComponent
  ]
})
export class WidgetsModule { }

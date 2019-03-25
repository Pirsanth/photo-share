import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }
  @Output()confirmation = new EventEmitter<boolean>();

  ngOnInit() {
  }
  print(){
    console.log();
  }
  sendConfirmation(response:boolean){
    this.confirmation.emit(response);
  }
}

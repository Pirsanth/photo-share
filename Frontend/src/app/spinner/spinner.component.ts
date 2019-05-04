import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subject } from "rxjs";


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit{


  @Input()show:boolean = false;
  @Input()progressBar:boolean = false;
  @Input()percentageComplete: string = "0%";
  @Output()uploadCanceled: EventEmitter<boolean> = new EventEmitter();
  componentDestroyed:Subject<boolean> = new Subject();
  constructor() { }

  ngOnInit() {}
  cancelUpload(){
    this.uploadCanceled.next(true);
  }
}

import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { SpinnerService } from "../services/spinner.service";
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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

  ngOnInit() {
/*
    this.router.events.subscribe(evt => {
        if(evt instanceof NavigationStart){
            this.show = true;
        }
        else if(evt instanceof NavigationEnd ||
                evt instanceof NavigationError ||
                evt instanceof NavigationCancel){
          this.show = false;
        }
    })
*/
  }
  cancelUpload(){
    this.uploadCanceled.next(true);
  }
}

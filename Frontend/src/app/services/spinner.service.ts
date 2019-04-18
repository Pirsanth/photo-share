import { Injectable, OnDestroy } from '@angular/core';
import {  } from "rxjs/operators";
import { Subject,  } from "rxjs";
import { stateObject } from "../customTypes";


/*
@Injectable({
  providedIn: 'root'
})
*/

export class SpinnerService implements OnDestroy {

  private changeState =  new Subject<boolean>()
  changeState$ = this.changeState.asObservable();

  constructor() { }

  showSpinner(){
    this.changeState.next(true);
  }
  closeSpinner(){
    this.changeState.next(false);
  }
  ngOnDestroy(){
    this.changeState.complete();
  }
}

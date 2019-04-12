import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MessageService } from "../../services/message.service";
import { Subject, Observable, fromEvent, merge, of } from "rxjs";
import { map, scan, filter, mergeMap, takeUntil, tap, share, buffer, take } from "rxjs/operators";

class messageObject {
  animate:boolean = false;
  constructor(public message:string){}
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy {
  @ViewChild("container") popupContainer;
  messages: Observable<string>;
  messageStack: Array<{message:string, animate:boolean}>;
  messageCount:number = 0;
  componentDestroyed: Subject<boolean> = new Subject();
  movedPopups:number = 0;
  constructor(private service: MessageService) { }

  ngOnInit() {
    if(this.service.isCacheFull()){
      const stringArr = this.service.getCacheAndClear();
      this.messageStack = stringArr.map( (message) => new messageObject(message));
      this.messageCount = stringArr.length;
    }
  }
  ngAfterViewInit() {

    const start$ = fromEvent(this.popupContainer.nativeElement, "animationstart");
    const end$ = fromEvent(this.popupContainer.nativeElement, "animationend");

      start$
      .pipe(
        takeUntil(this.componentDestroyed)
      )
      .subscribe(x =>{
          this.movedPopups++;
      })

    const noAnimationsStillRunning$ =
      merge(
        start$.pipe(map( (x)=> 1)),
        end$.pipe(map( (x)=> -1))
      ).pipe(
        scan((acc, curr) => acc + curr, 0),
        filter( (val)=> val === 0),
        tap(() => {
          /*
            We do not want to change the array while the animations are running as
            it will interrupt the animations if we remove the element we are currently animating.
            At the same time, we want to clear the stack of clicked popups before
            the code to add buffered popups (if there are any) is run
          */
          this.messageStack = this.messageStack.slice(0, this.messageStack.length - this.movedPopups);
          this.movedPopups = 0;
        }),
        share(),
      );

      noAnimationsStillRunning$
      .pipe(
        takeUntil(this.componentDestroyed)
      )
      .subscribe()


      this.service.messages$.pipe(
              mergeMap( (value:string) => {
                if(this.movedPopups){
//for buffer to work the observable it pipes into must not complete immedially so the operator "of" can't be used
                  const observable = new Observable((subscriber) => {
                    subscriber.next(value);
                  })
                  return observable.pipe( buffer(noAnimationsStillRunning$), take(1), map((arr) => arr[0]) );
                }
                else{
                  return of(value)
                }
              }),
              takeUntil(this.componentDestroyed)
          ).subscribe((message: string) =>{
            /*
              Adds new messages to the stack when animations have ended or when there are no ongoing animations
            */
            this.messageStack.push(new messageObject(message));
            this.messageCount = this.messageStack.length;
          });
  }
  ngOnDestroy(){
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
  decrementCount(indexOfClickedPopup:number){
    if(!this.hasBeenClickedBefore(indexOfClickedPopup)){
      this.messageCount--;
    }
  }
  hasBeenClickedBefore(indexOfClickedPopup: number):boolean {
    const numberOfUnclickedPopups = this.messageStack.length - this.movedPopups;
    return indexOfClickedPopup + 1  > numberOfUnclickedPopups;
  }
}

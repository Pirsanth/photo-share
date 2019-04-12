import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from, merge, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy{
  private cachedMessages: string[] = [];
  private messageSubject: Subject<string> = new Subject();
  messages$: Observable<string> = this.messageSubject.asObservable();

 constructor() {
   console.log("Message constructor is made")
 }

 get hasSubscribers():boolean{
   return this.messageSubject.observers.length > 0;
 }
 ngOnDestroy(){
   this.messageSubject.complete();
 }
 addMessage(message: string){
   if(this.hasSubscribers){
    this.messageSubject.next(message);
   }
   else {
     this.cachedMessages.push(message);
   }
 }
 private clearCache():void{
   this.cachedMessages = [];
 }
 getCacheAndClear():string[]{
   const messages = this.cachedMessages;
   this.clearCache();
   return messages;
 }
 isCacheFull():boolean{
   return this.cachedMessages.length > 0;
 }

}

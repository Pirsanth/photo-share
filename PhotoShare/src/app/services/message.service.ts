import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from, merge, Observable } from "rxjs";
import {  concat } from "rxjs/operators";
/*
*/

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy{
  private cachedMessages: string[] = [];
  private messageSubject: Subject<string> = new Subject();
  messages$: Observable<string> = this.messageSubject.asObservable();

 constructor() {}

 ngOnDestroy(){
   this.messageSubject.complete();
 }
 addToCache(message: string){
   this.cachedMessages.push(message);
 }
 private clearCache():void{
   this.cachedMessages = [];
 }
 getCacheAndClear():string[]{
   const messages = this.cachedMessages;
   this.clearCache();
   return messages;
 }
 displayMessageImmediately(msg:string) {
   this.messageSubject.next(msg);
 }
 isCacheFull():boolean{
   return this.cachedMessages.length > 0;
 }

}

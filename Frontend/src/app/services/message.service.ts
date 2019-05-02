import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from, merge, Observable } from "rxjs";
import { FeatureArea } from "../customTypes";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy{
  private cachedMessages: string[] = [];
  private userCachedMessages:string[] = [];
  private addPicturesCachedMessages:string[] = [];
  private messageSubject: Subject<string> = new Subject();
  messages$: Observable<string> = this.messageSubject.asObservable();

 constructor(private router:Router) {}

 ngOnDestroy(){
   this.messageSubject.complete();
 }

 addMessage(message: string, featureArea:FeatureArea){
   if(this.componentIsActive(featureArea)){
     this.messageSubject.next(message);
   }
   else {
     this.getRelevantCache(featureArea).push(message);
   }
 }

 private componentIsActive(featureArea:FeatureArea):boolean{
   if(featureArea === FeatureArea.addPictures && this.router.isActive("/addNew", false)){
     return true;
   }
   else if(featureArea === FeatureArea.users && this.router.isActive("/user", false)){
     return true;
   }
   else {
     return false
   }
 }

 getCacheAndClear(featureArea:FeatureArea):string[]{
     let cache = this.getRelevantCache(featureArea);
     const clonedCache = [...cache];
     cache.splice(0, cache.length);
     //do not want to pass a reference that might get mutated
     return clonedCache;
 }

 isCacheFull(featureArea:FeatureArea):boolean{
   return this.getRelevantCache(featureArea).length > 0;
 }

 getRelevantCache(featureArea:FeatureArea):string[]{
   /*
    Returns the appropriate cache based on the feature area
   */
   if(featureArea === FeatureArea.addPictures){
     return this.addPicturesCachedMessages
   }
   else if(featureArea === FeatureArea.users){
     return this.userCachedMessages;
   }
 }
}

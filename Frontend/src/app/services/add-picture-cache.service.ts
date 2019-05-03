import { Injectable } from '@angular/core';
import { FormState } from "../customTypes";

@Injectable({
  providedIn: 'root'
})
export class AddPictureCacheService {
/*
   For now it only caches forms that have passed
   all the frontend validation checks.

   To be specific, when the pictures are uploading,
   the spinner is showing and the user navigates to another
   component, the form state will be cached.

   I did this although it makes form much more complex because
   if the upload resulted in an error or if the user decided
   to cancel the request I want the data in the form to be preserved.
   It would reduce the user experience if the form has to be filled in
   multiple times

   I checked the logic and its okay if we just pass references of formState and
   savedPictures as its just stored and then used to set the state of the form
   component. (state refers to the properties of the class)
*/

  private formState:FormState;
  private savedPictures: any[];
  constructor() { }

  retrieveCache(){
    const { formState, savedPictures } = this;
    this.clearCache()
    return {formState, savedPictures};
  }
   saveToCache(formState:any, formDataPictures: any[]):void{
    this.formState = formState;
    this.savedPictures = formDataPictures;
  }
  get isFull():boolean{
    return !!this.formState && !!this.savedPictures;
  }
  clearCache():void{
    this.savedPictures = null;
    this.formState = null;
  }
}

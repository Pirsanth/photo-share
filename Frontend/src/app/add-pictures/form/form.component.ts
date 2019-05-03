import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import { ActivatedRoute } from "@angular/router";
import { Validators, FormBuilder, FormArray, FormControl} from "@angular/forms";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MessageService } from "../../services/message.service";
import { FormComponent as CanDeactivateComponent, FormState, FeatureArea } from "../../customTypes";
import { AddPictureCacheService } from "../../services/add-picture-cache.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit, CanDeactivateComponent, OnDestroy{
  featureArea = FeatureArea.addPictures;
  cachedPictures: any[];
  destroyComponent: Subject<boolean> = new Subject();
  percentageUploaded: string;
  showSpinner:boolean = false;
  useExisting: boolean = false;
  previewSrc: Array<string | ArrayBuffer> = [];
  customPictureTitle: boolean = false;
  albumList: string[];
  picturesForm = this.fb.group({
    albumName: ["", this.customAlbumNameValidator.bind(this)],
    pictureTitles: this.fb.array([]),
    fileControl: ["", [this.customRequiredValidator.bind(this), this.fileControlValidator.bind(this)]]
  });
  showModal:boolean = false;
  private responseSubject:Subject<boolean> = new Subject<boolean>();
  private submitObserver = {
    next: ()=> {
                this.showSpinner = false;
                this.cachedPictures = null;
                this.clearForm();
               },
    error: ()=> {
                  this.showSpinner = false
                }
   }
  projectedModalMessage: string;

  get response$(){
    return this.responseSubject.pipe(
      take(1)
    )
  }
  @ViewChild('fileInput')fileInput:ElementRef;
  @ViewChild("form")formElement:ElementRef;

  get pictureTitles(): FormArray{
    return this.picturesForm.get("pictureTitles") as FormArray;
  }
  set pictureTitles(newFormArray: FormArray){
   this.picturesForm.setControl("pictureTitles", newFormArray);
  }
  get albumName(){
    return this.picturesForm.get("albumName");
  }
  get fileControl(){
    return this.picturesForm.get("fileControl");
  }
  constructor(private ajax:AlbumsService, private route: ActivatedRoute,
    private fb:FormBuilder, private message:MessageService, private cache:AddPictureCacheService) { }

  ngOnInit(){

    this.route.data.pipe(
      takeUntil(this.destroyComponent)
    ).subscribe( data => this.albumList = data.albumList)

    this.ajax.percentageUploaded$.pipe(
      takeUntil(this.destroyComponent)
    ).subscribe( x => this.percentageUploaded = x)

    if(this.ajax.uploadingFiles){
      this.showSpinner = true;
    }

    if(this.cache.isFull){
      const cache = this.cache.retrieveCache();
      this.setStateFromCache(cache);
    }
  }

  ngAfterViewInit(){
  }
  ngAfterViewChecked(){
  }
  setStateFromCache({ formState, savedPictures }){

    this.cachedPictures = savedPictures;

    //makes the form array before setting the picsSrc
    const numberOfPics = savedPictures.length;
    this.makeNewFormArray(numberOfPics);

    //sets the radio buttons and the previewSrc
    const entries = Object.entries(formState.simpleValues);
    for(const [name, value] of entries){
        this[name] = value;
    }

    //sets the form's input values that are not the file input
    this.picturesForm.patchValue(formState.partialFormGroupValues);

    /*
     Make the file input valid
     The form control updates validity on a change event. If the user chooses the same
     file(s) again (as the pictures cached) it will considered a change because the file input
     element starts with value="".
     This is something to keep in mind. The problem is that input's value cannot be set programmatically
    */
    this.fileControl.setErrors(null);

    /*so as to display a confirmation dialog when the user navigates away AND
      the spinner is not showing*/
    this.picturesForm.markAsDirty();
  }
  fileControlValidator(control: FormControl){
    /*
      This ensures that more than 5 files have not been
      selected

      If the view has not been initialized it passes (passes
      only this validator, not the required validator one as well)
    */
    if(this.fileInput && this.fileInput.nativeElement.files.length > 5){
      return {maxFilesExceeded: true}
    }
    else{
      return  null;
    }
  }
  customRequiredValidator(control:FormControl){
    /*
      If we are using cached pictures, it passes
    */
    if(this.cachedPictures){
      return null;
    }
    else{
      return Validators.required(control);
    }
  }
  customAlbumNameValidator(albumName:FormControl){
    if(this.useExisting){
      return null;
    }
    else{
      return Validators.required(albumName);
    }
  }

  handleSubmit(form: HTMLFormElement){
    let formData = new FormData(form);

    if(this.picturesForm.valid){
      if(this.cachedPictures){
        formData = this.useCachedPicturesInstead(formData);
      }
      this.showSpinner = true;
      this.ajax.sendForm(formData).subscribe(this.submitObserver);
    }
    else{

      //so all the validation messages show
      this.dirtyAllInputs();

      //only the pictureTitle is invalid, show a confirmation dialog
      if(this.albumName.valid && this.fileControl.valid){

        this.response$.subscribe( (response:boolean) => {
          if(response){
            if(this.cachedPictures){
              formData = this.useCachedPicturesInstead(formData);
            }
            this.showSpinner = true;
            this.ajax.sendForm(formData).subscribe(this.submitObserver);
          }
        });
        const message = "Some of the picture titles are empty. The server will add titles automatically for these pictures. Would you like to proceed?";
        this.projectedModalMessage = message;
        this.toggleModal();
      }

    }

  }
  useCachedPicturesInstead(formData:FormData){
    formData.delete("picture");
    this.cachedPictures.forEach(x => formData.append("picture", x));
    return formData;
  }
  clearForm(){
    this.picturesForm.reset();
    this.clearPreview();
  }
  makePicturePreview(fileList:FileList){
    this.clearPreview();
    this.makeNewFormArray(fileList.length);

    for(let i = 0; i < fileList.length; i ++){
        this.readFileIntoAURL(fileList[i], i);
    }
  }
  clearPreview():void{
    this.previewSrc = [];
  }
  readFileIntoAURL(file:File, index:number){
    var fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = (progressEvent) => {
        var fileReader = progressEvent.target as FileReader;
        this.previewSrc.splice(index, 0, fileReader.result)

      }
      fileReader.onerror = (err) => {
        console.error(err);
      }
  }
  updateValidityOfPictureTitles(){
    this.pictureTitles.controls.forEach(control => {
      control.updateValueAndValidity();
    })
  }
  pictureTitleValidator(control:FormControl){
    if(this.customPictureTitle){
      return Validators.required(control);
    }
    else{
      return null;
    }
  }
  makeNewFormArray(numberOfPics: number){
      var controlsArray: Array<FormControl> = [];
      for(let i=0; i<numberOfPics; i++){
        controlsArray.push(this.fb.control("", this.pictureTitleValidator.bind(this)))
      }
      this.pictureTitles = this.fb.array(controlsArray);
  }
  toggleModal(){
    this.showModal = !this.showModal;
  }
  dirtyAllInputs(){
    this.fileControl.markAsDirty();
    this.albumName.markAsDirty();
    this.pictureTitles.controls.forEach(control =>{
        control.markAsDirty();
    })
  }
  canDeactivate(){
    if(this.ajax.uploadingFiles){
      this.savetoCache();
      return true;
    }
    else if(this.picturesForm.dirty){
      this.projectedModalMessage = "Discard changes to the form?";
      this.toggleModal();
      return this.response$;
    }
    else{
      return true;
    }
  }
  cancelRequest(){
    this.ajax.cancelUpload();
    this.message.addMessage("The picture upload was canceled by the user", FeatureArea.addPictures);
  }
  ngOnDestroy(){
      this.destroyComponent.next(true);
      this.destroyComponent.complete();
  }
  savetoCache(){

      const { useExisting, previewSrc, customPictureTitle, picturesForm } = this;
      const simpleValues = {useExisting, previewSrc, customPictureTitle};

      const formGroupValues = picturesForm.value;
      delete formGroupValues.fileControl;

      const formState = {
                         simpleValues,
                         partialFormGroupValues: picturesForm.value
                        };

      //saving the file input data
      let formDataPictures:any[];
      if(this.cachedPictures){
        formDataPictures = this.cachedPictures;
      }
      else{
        const formData =  new FormData(this.formElement.nativeElement);
        formDataPictures = formData.getAll("picture");
      }

      this.cache.saveToCache(formState, formDataPictures);

  }
  update(){
    console.log()
    //this.fileControl.setErrors(null);
  //  this.picturesForm.updateValueAndValidity();
  }
  print(){
    console.log(this.picturesForm.dirty);
    /*
    console.log(this.formElement.nativeElement)
    var formData = new FormData(this.formElement.nativeElement);
    console.log(formData.getAll("picture"));
    */

  //  console.log(this.fileControl.value, this.fileControl.valid)
  }
}

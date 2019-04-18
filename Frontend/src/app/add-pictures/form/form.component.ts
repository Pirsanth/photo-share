import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import { ActivatedRoute } from "@angular/router";
import { Validators, FormBuilder, FormArray, FormControl} from "@angular/forms";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MessageService } from "../../services/message.service";
import { FormComponent as CanDeactivateComponent } from "../../customTypes";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, CanDeactivateComponent, OnDestroy{
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
    fileControl: ["", Validators.required]
  });
  showModal:boolean = false;
  private responseSubject:Subject<boolean> = new Subject<boolean>();
  private submitObserver = {
    next: ()=> {
                this.showSpinner = false
                this.message.addMessage("The picture was added successfully")
                this.clearForm();
               },
    error: ()=> {
                  this.showSpinner = false
                  this.message.addMessage("An error occured while adding the picture")
                }
   }
  projectedModalMessage: string;

  get response$(){
    return this.responseSubject.pipe(
      take(1)
    )
  }
  @ViewChild('fileInput')fileInput:ElementRef;


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
  constructor(private ajax:AlbumsService, private route: ActivatedRoute, private fb:FormBuilder, private message:MessageService) { }

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
  }
  ngAfterViewInit(){
      //we need the ViewChild to complete for the custorm validation function
      this.fileControl.setValidators([Validators.required, this.fileControlValidator.bind(this)]);
  }
  fileControlValidator(control: FormControl){
    if(this.fileInput.nativeElement.files.length > 5){
      return {maxFilesExceeded: true}
    }
    else{
      return  null;
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
    if(this.picturesForm.valid){
      let formData = new FormData(form);
      this.showSpinner = true;
      this.ajax.sendForm(formData).subscribe(this.submitObserver);
    }
    else{

      this.dirtyAllInputs();
      //so all the validation messages show

      if(this.albumName.valid && this.fileControl.valid){
        //only the pictureTitle is invalid, show a confirmation dialog
        this.response$.subscribe( (response:boolean) => {
          if(response){
            let formData = new FormData(form);
            this.ajax.sendForm(formData).subscribe(this.submitObserver);
          }
        });
        const message = "Some of the picture titles are empty. The server will add titles automatically for these pictures. Would you like to proceed?";
        this.projectedModalMessage = message;
        this.toggleModal();
      }

    }
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
    if(this.picturesForm.dirty){
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
    this.message.addMessage("The picture upload was canceled by the user");
  }
  ngOnDestroy(){
      this.destroyComponent.next(true);
      this.destroyComponent.complete();
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import { ActivatedRoute } from "@angular/router";
import { Validators, FormBuilder, FormArray, FormControl} from "@angular/forms";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { MessageService } from "../../services/message.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
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
  response$:Subject<boolean> = new Subject<boolean>();
  private submitObserver = {
    next: ()=> {
                this.message.addMessage("The picture was added successfully")
                this.clearForm();
               },
    error: ()=> this.message.addMessage("An error occured while adding the picture"),
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
    this.route.data.subscribe( data => this.albumList = data.albumList)
  }
  custom(){
    return {someErr: "asdf"}
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
      this.ajax.sendForm(formData).subscribe(this.submitObserver);
    }
    else{

      this.dirtyAllInputs();
      //so all the validation messages show

      if(this.albumName.valid && this.fileControl.valid){
        //only the pictureTitle is invalid, show a confirmation dialog
        this.response$.pipe(
          take(1)
        ).subscribe( (response:boolean) => {
          if(response){
            let formData = new FormData(form);
            this.ajax.sendForm(formData).subscribe(this.submitObserver);
          }
        });
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
}

import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../services/ajax.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  useExisting: boolean = false;
  previewSrc: Array<string | ArrayBuffer> = [];
  multipleUpload: boolean = false;
  customPictureTitle: boolean = false;

  constructor(private ajax:AjaxService) { }

  ngOnInit() {
  }
  handleSubmit(form: HTMLFormElement){
    let formData = new FormData(form);
    this.ajax.sendForm(formData, this.multipleUpload).subscribe((x) => console.log(x))
  }
  print(){
    console.log(this.multipleUpload);
    }
  readFile(fileList:FileList){
    this.previewSrc = [];

    if(fileList.length>1){
      this.multipleUpload = true;
    }
    else{
      this.multipleUpload = false;
    }

    for(let i = 0; i < fileList.length; i ++){
        this.readFileIntoAURL(fileList[i]);
    }
  }
  readFileIntoAURL(file:File){
    var fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = (progressEvent) => {
        var fileReader = progressEvent.target as FileReader;
        this.previewSrc.push(fileReader.result);
      }
      fileReader.onerror = (err) => {
        console.error(err);
      }
  }

}

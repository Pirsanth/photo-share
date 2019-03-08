import { Component, OnInit } from '@angular/core';
import {AlbumsService} from "../services/albums.service";
import { ActivatedRoute } from "@angular/router";

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
  albumList: string[];

  constructor(private ajax:AlbumsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => this.albumList = data.albumList)
  }
  handleSubmit(form: HTMLFormElement){
    let formData = new FormData(form);
    this.ajax.sendForm(formData, this.multipleUpload).subscribe()
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

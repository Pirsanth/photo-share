import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  previewSrc: string | ArrayBuffer;

  constructor(private auth:AuthenticationService) { }

  ngOnInit() {
  }

  readFileIntoAURL(file:File){
    var fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = (progressEvent) => {
        var fileReader = progressEvent.target as FileReader;
        this.previewSrc = fileReader.result;
      }
      fileReader.onerror = (err) => {
        console.error(err);
      }
  }
  handleSubmit(form: HTMLFormElement){
   var formData = new FormData(form);
   this.auth.signUp(formData).subscribe(x => console.log(x));
  }
}

import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../services/ajax.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  useExisting: boolean = false;

  constructor(private ajax:AjaxService) { }

  ngOnInit() {
  }
  handleSubmit(form){
    let formData = new FormData(form);
    this.ajax.sendForm(formData).subscribe((x) => console.log(x))
  }
  print(){
    console.log(this.useExisting)
  }

}

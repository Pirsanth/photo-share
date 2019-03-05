import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title:string = 'PhotoShare';
  username:string;
  constructor(private auth:AuthenticationService){}

  ngOnInit(){
    this.auth.username$.subscribe( (x) => this.username = x)
  }
}

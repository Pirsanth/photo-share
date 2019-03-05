import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css']
})
export class AuthShellComponent implements OnInit {
  message:string;
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(x => this.message = x["message"])
  }

}

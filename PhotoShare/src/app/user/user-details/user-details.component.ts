import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";
import { MessageService } from "../../services/message.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  username:string;

  constructor(private auth:AuthenticationService, private router: Router, private message:MessageService) { }

  ngOnInit() {
    this.username = this.auth.currentUser;
  }
  handleLogout(){
    this.auth.logout().subscribe(
      success => {
      this.message.addMessage("User successfully logged out");
      this.router.navigate(["/user", "authenticate"]);
      }
    )
  }

}

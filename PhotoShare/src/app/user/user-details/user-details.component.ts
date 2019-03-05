import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  username:string;

  constructor(private auth:AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.username = this.auth.currentUser;
  }
  handleLogout(){
    this.auth.logout().subscribe(x => {
      console.log("User successfully logged out")
      this.router.navigate(["/user", "authenticate"], {state: {message: "User successfully logged out"}});
    })
  }

}

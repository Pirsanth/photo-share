import { Component, OnInit } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import {Album} from "./../../customTypes";
import { AuthenticationService } from "../../services/authentication.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
albumList: Album[];
isLoggedIn:boolean;
  constructor(private http:AlbumsService, private auth:AuthenticationService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.albumList = data.albumList);

    this.isLoggedIn = !!this.auth.currentUser;
  }


}

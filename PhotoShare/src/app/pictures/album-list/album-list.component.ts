import { Component, OnInit } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import {Album} from "./../../customTypes";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
albumList: Album[] = [];
isLoggedIn:boolean;
  constructor(private http:AlbumsService, private auth:AuthenticationService) { }

  ngOnInit() {
    this.http.getAllAlbums().subscribe((arr) => {
        this.albumList = arr;
    })
    this.isLoggedIn = !!this.auth.currentUser;
  }

}

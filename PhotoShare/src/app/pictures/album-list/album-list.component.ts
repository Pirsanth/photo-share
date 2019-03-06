import { Component, OnInit } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import {Album} from "./../../customTypes";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
albumList: Album[];
  constructor(private http:AlbumsService) { }

  ngOnInit() {
    this.http.getAllAlbums().subscribe((arr) => {
        this.albumList = arr;
    })
  }

}

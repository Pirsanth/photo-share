import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../services/ajax.service";
import {Album} from "./../../customTypes";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
albumList: Album[];
  constructor(private http:AjaxService) { }

  ngOnInit() {
    this.http.getAllAlbums().subscribe((arr) => {
      console.log(arr);
        this.albumList = arr;
    })
  }

}

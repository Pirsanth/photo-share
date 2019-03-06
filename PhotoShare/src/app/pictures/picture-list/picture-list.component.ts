import { Component, OnInit } from '@angular/core';
import {AlbumsService} from "../../services/albums.service";
import {Album} from "../../customTypes";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.css']
})
export class PictureListComponent implements OnInit {
  album: Album;
  constructor(private http: AlbumsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => this.album = data.album );
  }

}

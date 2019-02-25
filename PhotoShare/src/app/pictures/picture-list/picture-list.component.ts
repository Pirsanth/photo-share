import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../services/ajax.service";
import {Album} from "../../customTypes";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.css']
})
export class PictureListComponent implements OnInit {
  album: Album;
  constructor(private http: AjaxService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      const albumName = param.get("albumName");
      this.http.getAnAlbum(albumName).subscribe((album) => {this.album = album; console.log(album)});
    })
  }

}

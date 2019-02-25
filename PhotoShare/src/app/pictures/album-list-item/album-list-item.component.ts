import { Component, OnInit,Input } from '@angular/core';
import {Album} from "./../../customTypes";

@Component({
  selector: 'app-album-list-item',
  templateUrl: './album-list-item.component.html',
  styleUrls: ['./album-list-item.component.css']
})
export class AlbumListItemComponent implements OnInit {
  @Input() album:Album
  placeholders: string[] = [];

  constructor() { }

  ngOnInit() {
    const {numberOfPics} = this.album;
    if(numberOfPics < 4){
        for(let i=0; i < 4-numberOfPics; i++){
          this.placeholders.push("placeholder");
        }
    }
  }
  pictureOrPictures(): string{
    return (this.album.numberOfPics > 1)? "pictures": "picture";
  }
}

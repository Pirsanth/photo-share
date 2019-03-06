import { Component, OnInit, Input, HostListener } from '@angular/core';
import { LikesService } from "../../services/likes.service";
import {AlbumsService} from "../../services/albums.service";

type voters = {name: string, value: 1 | -1};
var a = [{name:"äsnjas", value: 1}]
@Component({
  selector: 'app-picture-list-item',
  templateUrl: './picture-list-item.component.html',
  styleUrls: ['./picture-list-item.component.css']
})
export class PictureListItemComponent implements OnInit {
  @Input()thumbnailSrc: string;
  @Input()likes: number
  @Input()title: string;
  @Input()uploadedBy: string;
  @Input()numberOfComments: number;
  @Input()albumName: string;
  @Input()voters:Array<voters>;

  showUploader: boolean = false;
  likePicture: boolean;
  voted: boolean;
  constructor(private ajaxLikes:LikesService, private albumService:AlbumsService) { }

  //the voters array is such that a username does not appear more than once
  ngOnInit() {

    const userVotes = this.voters.filter( (value) => value.name === this.albumService.username );
    if(userVotes.length){
      const {value} = userVotes[0];
      this.voted = true;

      if(value === 1){
        this.likePicture = true;
      }
      else{
        this.likePicture = false;
      }
    }
    else{
      this.voted = false;
      this.likePicture = undefined;
    }
  }
  @HostListener("mouseover") toggleUploader1(){
    this.showUploader = true;
  }
  @HostListener("mouseleave") toggleUploader2(){
    this.showUploader = false;
  }
  incrementLikes(){
    if(this.voted && this.likePicture){
      this.voted = false;
      this.likePicture = undefined;
      this.likes -= 1;
      this.ajaxLikes.removeLikes(1, this.albumName, this.title)
      .subscribe(x => console.log("DELETE was a success"));
    }
    else if(this.voted && !this.likePicture){
      this.likePicture = true;
      this.likes += 2;
      this.ajaxLikes.editLikes(-1, 1, this.albumName, this.title)
      .subscribe(x => console.log("PUT from -1 to 1 sucessful"))
    }
    else{
      this.voted = true;
      this.likePicture = true;
      this.likes += 1;
      this.ajaxLikes.addLikes(1, this.albumName, this.title)
      .subscribe(x => console.log("POST was a success"));
    }
  }
  decrementLikes(){
    if(this.voted && !this.likePicture){
      this.voted = false;
      this.likePicture = undefined;
      this.likes += 1;
      this.ajaxLikes.removeLikes(-1, this.albumName, this.title)
      .subscribe(x => console.log("DELETE was a success"));
    }
    else if(this.voted && this.likePicture){
      this.likePicture = false;
      this.likes -= 2;
      this.ajaxLikes.editLikes(1, -1, this.albumName, this.title)
      .subscribe(x => console.log("PUT from 1 to -1 sucessful"))
    }
    else{
      this.voted = true;
      this.likePicture = false;
      this.likes -= 1;
      this.ajaxLikes.addLikes(-1, this.albumName, this.title)
      .subscribe(x => console.log("POST was a success"))
    }
  }
}

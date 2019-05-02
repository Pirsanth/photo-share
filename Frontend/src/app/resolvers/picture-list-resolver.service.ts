import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Album } from "../customTypes";
import { Observable } from "rxjs";
import { AlbumsService } from "../services/albums.service";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PictureListResolverService implements Resolve<Album>{

  constructor(private albums:AlbumsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album>{
    const albumName = route.paramMap.get("albumName");
    return this.albums.getAnAlbum(albumName)
           .pipe( take(1) )
  }
}

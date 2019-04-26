import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AlbumsService } from "../services/albums.service";
import { Album } from "../customTypes";

@Injectable({
  providedIn: 'root'
})
export class AlbumListResolverService implements Resolve<Array<Album>> {

  constructor(private ajaxAlbums:AlbumsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Album>>{
    return this.ajaxAlbums.getAllAlbums();
  }
}

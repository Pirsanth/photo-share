import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { AlbumsService } from "../services/albums.service";

@Injectable({
  providedIn: 'root'
})
export class FormResolverService implements Resolve<Array<string>> {

  constructor(private ajaxAlbums:AlbumsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<string>>{
    return this.ajaxAlbums.getAlbumsList()
           .pipe( take(1) )
  }
}

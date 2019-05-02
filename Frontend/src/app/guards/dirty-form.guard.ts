import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormComponent } from "../customTypes";

@Injectable({
  providedIn: 'root'
})
export class DirtyFormGuard implements CanDeactivate<FormComponent> {
  canDeactivate(component:FormComponent ){
    return component.canDeactivate();
  }
}
